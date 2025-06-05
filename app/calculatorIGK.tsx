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
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.header}>
        <View style={styles.backButtonPosition}>
          <BackButton />
        </View>
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
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>RDW (%)*:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={rdw}
          onChangeText={setRdw}
          placeholder="Ex: 14"
          placeholderTextColor="#888"
        />

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
          placeholder="Ex: 80"
          placeholderTextColor="#888"
        />

        <Text style={[styles.label, { marginTop: height * 0.025 }]}>
          Princípio de contagem do analisador*:
        </Text>

        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setPrincipio('impedancia')}
          >
            <View
              style={[
                styles.radioCircle,
                principio === 'impedancia' && styles.selectedRadio,
              ]}
            />
            <Text style={styles.radioText}>Impedância Elétrica</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setPrincipio('laser')}
          >
            <View
              style={[
                styles.radioCircle,
                principio === 'laser' && styles.selectedRadio,
              ]}
            />
            <Text style={styles.radioText}>Leitura Ótica/Laser</Text>
          </TouchableOpacity>

          <Text style={styles.cutOffText}>
            CUT OFF: {principio === 'impedancia' ? '65' : '70'}
          </Text>
        </View>

        <View style={styles.bottomButtons}>
          <BorderedButton title="CALCULAR" onPress={handleCalculate} />
        </View>

        {resultado && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Resultado IGK</Text>
            <Text style={styles.resultValueText}>Valor calculado: {resultado.igk?.toFixed(2) ?? 'N/A'}</Text>
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
  radioGroup: {
    flexDirection: 'column',
    marginVertical: height * 0.015,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  radioCircle: {
    height: width * 0.045,
    width: width * 0.045,
    borderRadius: width * 0.0225,
    borderWidth: 2,
    borderColor: '#F46F6F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    backgroundColor: '#F46F6F',
  },
  radioText: {
    marginLeft: width * 0.025,
    fontSize: width * 0.04,
  },
  cutOffText: {
    fontStyle: 'italic',
    fontSize: width * 0.03,
    marginTop: height * 0.005,
    color: '#555',
  },
  bottomButtons: {
    marginTop: height * 0.04,
    alignItems: 'center',
  },
  resultBox: {
    marginTop: height * 0.04,
    padding: width * 0.05,
    backgroundColor: '#f1f1f1',
    borderRadius: width * 0.03,
  },
  resultTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: height * 0.015,
  },
  resultValueText: {
    fontSize: width * 0.04,
    marginBottom: height * 0.005,
    color: '#333',
  },
  resultInterpretationText: {
    fontSize: width * 0.04,
    lineHeight: width * 0.055,
    color: '#333',
  },
  saveButton: {
    marginTop: height * 0.025,
    backgroundColor: '#F46F6F',
    paddingVertical: height * 0.015,
    borderRadius: width * 0.02,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: height * 0.02,
    width: '100%',
    paddingBottom: height * 0.04,
  },
});