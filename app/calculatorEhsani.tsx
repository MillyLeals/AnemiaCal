import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,     
  Dimensions, 
  Platform,   
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import BackButton from '../components/BackButton';
import BorderedButton from '../components/BorderedButton';
import InfoLinkButton from '../components/InfoLinkButton';
import { db } from '../lib/firebaseConfig';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


const { height, width } = Dimensions.get('window');

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
    <ScrollView contentContainerStyle={styles.scrollViewContent}> 
      <View style={styles.header}>
        <View style={styles.backButtonPosition}>
          <BackButton />
        </View>
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
          placeholderTextColor="#888" 
        />

        <Text style={styles.label}>VCM*:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={vcm}
          onChangeText={setVcm}
          placeholder="Ex: 85"
          placeholderTextColor="#888" 
        />

        <Text style={styles.label}>Cut Off*:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={cutOff}
          onChangeText={setCutOff}
          placeholder="15"
          placeholderTextColor="#888" 
        />

        <View style={styles.bottomButtons}>
          <BorderedButton title="CALCULAR" onPress={handleCalculate} />
        </View>

        {resultado && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Resultado Ehsani</Text>
            <Text style={styles.resultValueText}>Valor calculado: {resultado.ehsani?.toFixed(2) ?? 'N/A'}</Text> 
            <Text style={styles.resultInterpretationText}>{resultado.interpretacao}</Text>

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
  scrollViewContent: {
    paddingBottom: height * 0.04, 
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#F46F6F',
    height: Platform.OS === 'ios' ? height * 0.12 : height * 0.1,
    borderBottomLeftRadius: width * 0.07, 
    borderBottomRightRadius: width * 0.07, 
    paddingTop: Platform.OS === 'ios' ? height * 0.05 : height * 0.03, 
    paddingHorizontal: width * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', 
  },
  backButtonPosition: {
    position: 'absolute',
    left: width * 0.05,
    top: Platform.OS === 'ios' ? height * 0.06 : height * 0.03,
    zIndex: 1, 
  },
  headerTitle: {
    color: '#fff',
    fontSize: width * 0.06, 
    fontWeight: '600',
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: width * 0.05, 
    paddingTop: height * 0.025, 
  },
  label: {
    fontWeight: '600',
    marginBottom: height * 0.005, 
    marginTop: height * 0.015, 
    fontSize: width * 0.04, 
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#888',
    paddingVertical: height * 0.008, 
    marginBottom: height * 0.01, 
    fontSize: width * 0.04,
  },
  bottomButtons: {
    marginTop: height * 0.04,
    alignItems: 'center',
  },
  resultBox: {
    marginTop: height * 0.025, 
    padding: width * 0.04,
    borderWidth: 1,
    borderColor: '#F46F6F',
    borderRadius: width * 0.025, 
    backgroundColor: '#ffe6e6',
    width: '100%',
  },
  resultTitle: {
    fontWeight: '700',
    fontSize: width * 0.045, 
    marginBottom: height * 0.015, 
    color: '#b00000',
  },
  resultValueText: {
    fontSize: width * 0.038, 
    marginBottom: height * 0.005,
    color: '#333',
  },
  resultInterpretationText: {
    fontSize: width * 0.038, 
    lineHeight: width * 0.05, 
    color: '#333',
    marginTop: height * 0.008, 
  },
  saveButton: {
    backgroundColor: '#F46F6F',
    paddingVertical: height * 0.015, 
    paddingHorizontal: width * 0.17, 
    borderRadius: width * 0.025,
    marginTop: height * 0.03, 
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.04, 
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center', 
    marginTop: height * 0.02, 
    width: '100%',
    paddingBottom: height * 0.04, 
    flexWrap: 'wrap', 
    gap: width * 0.02, 
  },
});