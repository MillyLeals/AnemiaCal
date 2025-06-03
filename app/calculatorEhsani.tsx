import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import BackButton from '../components/BackButton';
import BorderedButton from '../components/BorderedButton';
import InfoLinkButton from '../components/InfoLinkButton';
import { db } from '../lib/firebaseConfig'; 
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function CalculatorEhsani() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const patientId = params.patientId as string | undefined;

  const [rbc, setRbc] = useState('');
  const [vcm, setVcm] = useState('');
  const [cutOff, setCutOff] = useState('15');

  const [resultado, setResultado] = useState<{
    ehsani: number | null;
    interpretacao: string;
  } | null>(null);

  const handleCalculate = () => {
    if (!rbc || !vcm || !cutOff) {
      setResultado(null);
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const rbcNum = parseFloat(rbc.replace(',', '.'));
    const vcmNum = parseFloat(vcm.replace(',', '.'));
    const cutOffNum = parseFloat(cutOff.replace(',', '.'));

    if (isNaN(rbcNum) || isNaN(vcmNum) || isNaN(cutOffNum)) {
      setResultado(null);
      Alert.alert('Erro', 'Por favor, insira valores numéricos válidos.');
      return;
    }

    const ehsani = vcmNum - 10 * rbcNum;

    let interpretacao = '';

    if (ehsani > cutOffNum && rbcNum < 5) {
      interpretacao =
        'Sugestivo de Anemia Ferropriva\n→ Indicar testes de metabolismo do ferro';
    } else if (ehsani < cutOffNum && rbcNum > 5) {
      interpretacao =
        'Sugestivo de Talassemia Menor\n→ Indicar Eletroforese de Hemoglobina';
    } else {
      interpretacao = 'Resultado inconclusivo. Avaliar com outros exames.';
    }

    setResultado({ ehsani, interpretacao });
  };

  const handleSaveResult = async () => {
    if (!resultado) return;

    if (!patientId) {
      Alert.alert('Erro', 'ID do paciente não informado.');
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Erro', 'Usuário não autenticado.');
        return;
      }

      await addDoc(collection(db, 'resultados_pacientes'), {
        uid: user.uid,
        patientId: patientId,
        rbc: parseFloat(rbc.replace(',', '.')),
        vcm: parseFloat(vcm.replace(',', '.')),
        cutOff: parseFloat(cutOff.replace(',', '.')),
        ehsani: resultado.ehsani,
        interpretacao: resultado.interpretacao,
        data: Timestamp.now(),
        tipo: 'Ehsani',
      });

      Alert.alert('Sucesso', 'Resultado salvo com sucesso!');  

    } catch (error) {
      console.error('Erro ao salvar resultado:', error);
      Alert.alert('Erro', 'Não foi possível salvar o resultado.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Calculadora Ehsani</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Contagem de Hemácias (RBC)*:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={rbc}
          onChangeText={setRbc}
          placeholder="Ex: 4.5"
        />

        <Text style={styles.label}>VCM*:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={vcm}
          onChangeText={setVcm}
          placeholder="Ex: 85"
        />

        <Text style={styles.label}>Cut Off*:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={cutOff}
          onChangeText={setCutOff}
          placeholder="15"
        />

        <View style={styles.bottomButtons}>
          <BorderedButton title="CALCULAR" onPress={handleCalculate} />
        </View>

        {resultado && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Resultado Ehsani</Text>
            <Text>Valor calculado: {resultado.ehsani?.toFixed(2) ?? 'N/A'}</Text>
            <Text>{resultado.interpretacao}</Text>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveResult}>
              <Text style={styles.saveButtonText}>SALVAR RESULTADO</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.linksRow}>
          <InfoLinkButton
            title="Ver Legendas"
            contentText={
              'LEGENDAS:\n\n' +
              'RBC: Contagem de hemácias (milhões/mm³)\n' +
              'VCM: Volume Corpuscular Médio (fL)\n' +
              'Cut Off: valor limite para interpretação do índice'
            }
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#F46F6F',
    height: 100,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#888',
    paddingVertical: 4,
    marginBottom: 8,
  },
  bottomButtons: {
    marginTop: 30,
    alignItems: 'center',
  },
  resultBox: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#F46F6F',
    borderRadius: 10,
    backgroundColor: '#ffe6e6',
    width: '100%',
  },
  resultTitle: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 15,
    color: '#b00000',
  },
  saveButton: {
    backgroundColor: '#F46F6F',
    paddingVertical: 10,
    paddingHorizontal: 70,
    borderRadius: 10,
    marginTop: 25,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    width: '100%',
  },
});