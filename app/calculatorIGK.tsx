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

export default function CalculatorIGK() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const patientId = params.patientId as string | undefined;

  const [hb, setHb] = useState('');
  const [rdw, setRdw] = useState('');
  const [rbc, setRbc] = useState('');
  const [vcm, setVcm] = useState('');

  const [principio, setPrincipio] = useState<'impedancia' | 'laser'>('impedancia');

  const [resultado, setResultado] = useState<{
    igk: number | null;
    interpretacao: string;
  } | null>(null);

  const handleCalculate = () => {
    if (!hb || !rdw || !rbc || !vcm) {
      setResultado(null);
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const hbNum = parseFloat(hb.replace(',', '.'));
    const rdwNum = parseFloat(rdw.replace(',', '.'));
    const rbcNum = parseFloat(rbc.replace(',', '.'));
    const vcmNum = parseFloat(vcm.replace(',', '.'));

    if (isNaN(hbNum) || isNaN(rdwNum) || isNaN(rbcNum) || isNaN(vcmNum)) {
      setResultado(null);
      Alert.alert('Erro', 'Por favor, insira valores numéricos válidos.');
      return;
    }

    const igk = (vcmNum * vcmNum * rdwNum) / (100 * hbNum);

    let interpretacao = '';
const cutOff = principio === 'impedancia' ? 65 : 70;

if (igk > cutOff && rbcNum < 5) {
  interpretacao = 'Sugestivo de Anemia Ferropriva\n→ Indicar testes de metabolismo do ferro';
} else if (igk <= cutOff && rbcNum > 5) {
  interpretacao = 'Sugestivo de Talassemia Menor\n→ Indicar Eletroforese de Hemoglobina';
} else {
  interpretacao = 'Resultado inconclusivo. Avaliar com outros exames.';
}

setResultado({ igk, interpretacao });
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
      hb: parseFloat(hb.replace(',', '.')),
      rdw: parseFloat(rdw.replace(',', '.')),
      rbc: parseFloat(rbc.replace(',', '.')),
      vcm: parseFloat(vcm.replace(',', '.')),
      principioContagem: principio,
      igk: resultado.igk,
      interpretacao: resultado.interpretacao,
      data: Timestamp.now(),
      tipo: 'IGK',
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
        <Text style={styles.headerTitle}>Calculadora IGK</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Hemoglobina (Hb)*:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={hb}
          onChangeText={setHb}
          placeholder="Ex: 12.5"
        />

        <Text style={styles.label}>RDW (%)*:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={rdw}
          onChangeText={setRdw}
          placeholder="Ex: 14"
        />

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
          placeholder="Ex: 80"
        />

        <Text style={[styles.label, { marginTop: 20 }]}>
          Princípio de contagem do analisador*:
        </Text>

        <View style={{ flexDirection: 'column', marginVertical: 10 }}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
            onPress={() => setPrincipio('impedancia')}
          >
            <View
              style={[
                styles.radioCircle,
                principio === 'impedancia' && styles.selectedRadio,
              ]}
            />
            <Text style={{ marginLeft: 10 }}>Impedância Elétrica</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => setPrincipio('laser')}
          >
            <View
              style={[
                styles.radioCircle,
                principio === 'laser' && styles.selectedRadio,
              ]}
            />
            <Text style={{ marginLeft: 10 }}>Leitura Ótica/Laser</Text>
          </TouchableOpacity>

          <Text style={{ fontStyle: 'italic', fontSize: 12, marginTop: 4, color: '#555' }}>
        CUT OFF: {principio === 'impedancia' ? '65' : '70'}
        </Text>
        </View>

        <View style={styles.bottomButtons}>
          <BorderedButton title="CALCULAR" onPress={handleCalculate} />
        </View>

        {resultado && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Resultado IGK</Text>
            <Text>Valor calculado: {resultado.igk?.toFixed(2) ?? 'N/A'}</Text>
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
              'Hb: Hemoglobina (g/dL)\n' +
              'RDW: Red Cell Distribution Width (%)\n' +
              'RBC: Contagem de hemácias (milhões/mm³)\n' +
              'VCM: Volume Corpuscular Médio (fL)\n' +
              'Fórmula: (RDW² × Hb) / (RBC × 100)'
            }
          />

          <InfoLinkButton
            title="Ver Notas"
            contentText={`Consultar o princípio de contagem do analisador hematológico utilizado pelo laboratório.\n\nCaso não consiga essa informação, utilizar o princípio de impedância!`}
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
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#F46F6F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    backgroundColor: '#F46F6F',
  },
  bottomButtons: {
    marginTop: 30,
    alignItems: 'center',
  },
  resultBox: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#F46F6F',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
    linksRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    width: '100%',
  },
});
