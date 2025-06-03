import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BorderedButton from '../components/BorderedButton';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';

interface PatientDetails {
  id?: string;
  name: string;
  cpf: string;
  birthDate: string;
  age: string;
  height: string;
  weight: string;
  gender: string;
}

export default function PatientData() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const initialPatient: PatientDetails = params.patient
    ? JSON.parse(params.patient as string)
    : {
        id: '',
        name: '',
        cpf: '',
        birthDate: '',
        age: '',
        height: '',
        weight: '',
        gender: '',
      };

  const [patient, setPatient] = useState<PatientDetails>(initialPatient);
  const originalPatientRef = useRef<PatientDetails>(initialPatient);

  const handleChange = (key: keyof PatientDetails, value: string) => {
    setPatient({ ...patient, [key]: value });
  };

  const isModified = () => {
    const original = originalPatientRef.current;
    return (
      patient.name !== original.name ||
      patient.birthDate !== original.birthDate ||
      patient.age !== original.age ||
      patient.height !== original.height ||
      patient.weight !== original.weight ||
      patient.gender !== original.gender
    );
  };

  const handleNavigateCalculator = () => {
    const ageNumber = Number(patient.age);
    if (isNaN(ageNumber)) {
      Alert.alert('Erro', 'Idade inválida. Informe um número válido.');
      return;
    }

    if (ageNumber > 14) {
      router.push({
        pathname: '/calculatorIGK',
        params: { patientId: patient.id },
      });
    } else {
      router.push({
        pathname: '/calculatorEhsani',
        params: { patientId: patient.id },
      });
    }
  };

  const handleSaveChanges = async () => {
    if (!patient.id) {
      Alert.alert('Erro', 'ID do paciente não encontrado!');
      return;
    }

    try {
      const patientRef = doc(db, 'pacientes', patient.id);
      await updateDoc(patientRef, {
        name: patient.name,
        cpf: patient.cpf,
        birthDate: patient.birthDate,
        age: patient.age,
        height: patient.height,
        weight: patient.weight,
        gender: patient.gender,
      });

      originalPatientRef.current = { ...patient };

      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      Alert.alert('Erro', 'Não foi possível atualizar os dados.');
    }
  };

  return (
    <View style={styles.screen}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={32} color="#ffff" />
      </TouchableOpacity>

      <View style={styles.headerTitleContainer}>
        <Text style={styles.title}>Dados do Paciente</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Nome:</Text>
          <TextInput
            style={styles.input}
            value={patient.name}
            onChangeText={(text) => handleChange('name', text)}
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>CPF:</Text>
          <TextInput
            style={styles.input}
            value={patient.cpf}
            onChangeText={(text) => handleChange('cpf', text)}
            editable={false}
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Data de Nascimento:</Text>
          <TextInput
            style={styles.input}
            value={patient.birthDate}
            onChangeText={(text) => handleChange('birthDate', text)}
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Idade:</Text>
          <TextInput
            style={styles.input}
            value={patient.age}
            onChangeText={(text) => handleChange('age', text)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Altura:</Text>
          <TextInput
            style={styles.input}
            value={patient.height}
            onChangeText={(text) => handleChange('height', text)}
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Peso:</Text>
          <TextInput
            style={styles.input}
            value={patient.weight}
            onChangeText={(text) => handleChange('weight', text)}
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Gênero:</Text>
          <TextInput
            style={styles.input}
            value={patient.gender}
            onChangeText={(text) => handleChange('gender', text)}
          />
        </View>

        <View style={{ alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <BorderedButton title="CALCULADORA" onPress={handleNavigateCalculator} />
          {isModified() && (
            <BorderedButton title="SALVAR ALTERAÇÕES" onPress={handleSaveChanges} />
          )}
        </View>

        <TouchableOpacity
          style={styles.resultButton}
          onPress={() => {
            if (patient.id) {
              router.push({
                pathname: '/result_data',
                params: { cpf: patient.cpf, patientId: patient.id },
              });
            } else {
              Alert.alert('Erro', 'ID do paciente não encontrado!');
            }
          }}
        >
          <Text style={styles.resultButtonText}>DADOS DO RESULTADO</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 2,
  },
  headerTitleContainer: {
    backgroundColor: '#F46F6F',
    height: 100,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  infoRow: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 6,
  },
  label: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  input: {
    fontSize: 14,
    color: '#000',
    marginTop: 2,
    paddingVertical: 4,
  },
  resultButton: {
    marginTop: 10,
    backgroundColor: '#F26464',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  resultButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
