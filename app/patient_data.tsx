import React, { useState, useRef } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BorderedButton from '../components/BorderedButton';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import BackButton from '../components/BackButton'; 

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

const { height, width } = Dimensions.get('window'); 

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
    <View style={styles.fullScreenContainer}> 
      <View style={styles.headerTitleContainer}>
        <View style={styles.backButtonPosition}>
          <BackButton /> 
        </View>
        <Text style={styles.title}>Dados do Paciente</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}> 
        <View style={styles.infoRow}>
          <Text style={styles.label}>Nome:</Text>
          <TextInput
            style={styles.input}
            value={patient.name}
            onChangeText={(text) => handleChange('name', text)}
            placeholderTextColor="#888" 
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>CPF:</Text>
          <TextInput
            style={styles.input}
            value={patient.cpf}
            onChangeText={(text) => handleChange('cpf', text)}
            editable={false}
            placeholderTextColor="#888" 
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Data de Nascimento:</Text>
          <TextInput
            style={styles.input}
            value={patient.birthDate}
            onChangeText={(text) => handleChange('birthDate', text)}
            placeholderTextColor="#888" 
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Idade:</Text>
          <TextInput
            style={styles.input}
            value={patient.age}
            onChangeText={(text) => handleChange('age', text)}
            keyboardType="numeric"
            placeholderTextColor="#888" 
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Altura:</Text>
          <TextInput
            style={styles.input}
            value={patient.height}
            onChangeText={(text) => handleChange('height', text)}
            placeholderTextColor="#888" 
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Peso:</Text>
          <TextInput
            style={styles.input}
            value={patient.weight}
            onChangeText={(text) => handleChange('weight', text)}
            placeholderTextColor="#888" 
          />
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Gênero:</Text>
          <TextInput
            style={styles.input}
            value={patient.gender}
            onChangeText={(text) => handleChange('gender', text)}
            placeholderTextColor="#888" 
          />
        </View>

        <View style={styles.buttonsContainer}> 
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
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerTitleContainer: {
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
    zIndex: 2, 
  },
  title: {
    fontSize: width * 0.06, 
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: height * 0.01, 
  },
  scrollViewContent: { 
    padding: width * 0.05, 
    paddingBottom: height * 0.05, 
    flexGrow: 1, 
  },
  infoRow: {
    marginBottom: height * 0.025,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: height * 0.008, 
  },
  label: {
    fontSize: width * 0.038, 
    color: '#000',
    fontWeight: 'bold',
  },
  input: {
    fontSize: width * 0.04, 
    color: '#000',
    marginTop: height * 0.005,
    paddingVertical: height * 0.005, 
  },
  buttonsContainer: { 
    alignItems: 'center',
    gap: height * 0.015,
    marginBottom: height * 0.025, 
    marginTop: height * 0.03, 
  },
  resultButton: {
    marginTop: height * 0.015, 
    backgroundColor: '#F46F6F',
    paddingVertical: height * 0.018, 
    borderRadius: width * 0.03, 
    alignItems: 'center',
  },
  resultButtonText: {
    color: '#fff',
    fontSize: width * 0.042, 
    fontWeight: 'bold',
  },
});