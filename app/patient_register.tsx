import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions, 
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaskedTextInput } from 'react-native-mask-text';
import dayjs from 'dayjs';

import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebaseConfig';

import BackButton from '../components/BackButton'; 
import BorderedButton from '../components/BorderedButton';
import GenderSelector from '../components/GenderSelector';

const { height, width } = Dimensions.get('window'); 

export default function PatientRegister() {
  const router = useRouter();

  const initialData = {
    name: '',
    cpf: '',
    birthDate: '',
    age: '',
    height: '',
    weight: '',
    gender: '',
  };

  const [formData, setFormData] = useState(initialData);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    const modified = Object.entries(formData).some(
      ([key, value]) => value !== initialData[key as keyof typeof initialData]
    );
    setIsModified(modified);
  }, [formData]);

  const calculateAge = (date: string) => {
    const [day, month, year] = date.split('/');
    if (!day || !month || !year) return '';
    const birthDate = dayjs(`${year}-${month}-${day}`);
    const today = dayjs();
    if (!birthDate.isValid() || birthDate.isAfter(today)) return '';
    return today.diff(birthDate, 'year').toString();
  };

  const validateCPF = (cpf: string) => {
    const numbers = cpf.replace(/[^\d]/g, '');
    if (numbers.length !== 11 || /^(\d)\1+$/.test(numbers)) return false;

    const calc = (length: number) => {
      let sum = 0;
      for (let i = 0; i < length; i++) {
        sum += parseInt(numbers.charAt(i)) * (length + 1 - i);
      }
      const result = (sum * 10) % 11;
      return result === 10 ? 0 : result;
    };

    return (
      calc(9) === parseInt(numbers[9]) && calc(10) === parseInt(numbers[10])
    );
  };

  const handleInputChange = (key: keyof typeof formData, value: string) => {
    if (key === 'birthDate') {
      const newAge = calculateAge(value);
      setFormData((prev) => ({ ...prev, birthDate: value, age: newAge }));
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const validateForm = () => {
    const { name, cpf, birthDate, height, weight, gender } = formData;

    if (!name || !cpf || !birthDate || !height || !weight || !gender) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return false;
    }

    if (!validateCPF(cpf)) {
      Alert.alert('Erro', 'CPF inválido. Verifique o número informado.');
      return false;
    }

    const altura = parseFloat(height.replace(',', '.'));
    const peso = parseFloat(weight.replace(',', '.'));

    if (isNaN(altura) || altura <= 0 || altura > 2.5) {
      Alert.alert('Erro', 'Informe uma altura válida (ex: 1,70).');
      return false;
    }

    if (isNaN(peso) || peso <= 0 || peso > 300) {
      Alert.alert('Erro', 'Informe um peso válido (ex: 65,50).');
      return false;
    }

    return true;
  };

  async function salvarPacienteNoBanco(pacienteData: typeof formData & { cpfNumbersOnly: string }) {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return null;
    }

    try {
      const docRef = await addDoc(collection(db, 'pacientes'), {
        ...pacienteData,
        userId: user.uid,
        criadoEm: new Date(),
        name_lowercase: pacienteData.name.trim().toLowerCase(),
      });

      Alert.alert('Sucesso', 'Paciente cadastrado com sucesso!');
      return docRef.id;
    } catch (error: any) {
      Alert.alert('Erro ao salvar', error.message);
      return null;
    }
  }

  const handleSave = async () => {
    if (!validateForm()) return;

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }

    const cpfNumbersOnly = formData.cpf.replace(/[^\d]/g, '');

    try {
      const q = query(
        collection(db, 'pacientes'),
        where('userId', '==', user.uid),
        where('cpfNumbersOnly', '==', cpfNumbersOnly)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        Alert.alert('Erro', 'Já existe um paciente cadastrado com esse CPF.');
        return;
      }
    } catch (error: any) {
      Alert.alert('Erro', 'Falha ao verificar CPF duplicado: ' + error.message);
      return;
    }

    const pacienteDataComCPF = {
      ...formData,
      height: formData.height.replace(',', '.'),
      weight: formData.weight.replace(',', '.'),
      cpfNumbersOnly,
    };

    const patientId = await salvarPacienteNoBanco(pacienteDataComCPF);
    if (!patientId) return;
    const ageNumber = Number(formData.age);

    if (ageNumber <= 14) {
      router.push({
        pathname: '/calculatorEhsani',
        params: { patientId, idade: ageNumber },
      });
    } else {
      router.push({
        pathname: '/calculatorIGK',
        params: { patientId, idade: ageNumber },
      });
    }

    setFormData(initialData);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewFlex}>
        <View style={styles.header}>
          <View style={styles.backButtonPosition}>
            <BackButton />
          </View>
          <Text style={styles.headerTitle}>Cadastro de Paciente</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nome Completo*:</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(val) => handleInputChange('name', val)}
            placeholder="Digite o nome completo"
            placeholderTextColor="#888" 
          />

          <Text style={styles.label}>CPF*:</Text>
          <MaskedTextInput
            mask="999.999.999-99"
            style={styles.input}
            keyboardType="numeric"
            value={formData.cpf}
            onChangeText={(val) => handleInputChange('cpf', val)}
            placeholder="000.000.000-00"
            placeholderTextColor="#888" 
          />

          <Text style={styles.label}>Data de Nascimento*:</Text>
          <MaskedTextInput
            mask="99/99/9999"
            style={styles.input}
            keyboardType="numeric"
            value={formData.birthDate}
            onChangeText={(val) => handleInputChange('birthDate', val)}
            placeholder="dd/mm/aaaa"
            placeholderTextColor="#888" 
          />

          {formData.age && (
            <Text style={styles.ageText}>Idade: {formData.age} anos</Text>
          )}

          <Text style={styles.label}>Altura (em metros)*:</Text>
          <MaskedTextInput
            mask="9,99"
            style={styles.input}
            keyboardType="decimal-pad"
            value={formData.height}
            onChangeText={(val) => handleInputChange('height', val)}
            placeholder="Ex: 1,70"
            placeholderTextColor="#888" 
          />

          <Text style={styles.label}>Peso (kg)*:</Text>
          <MaskedTextInput
            mask="99,99"
            style={styles.input}
            keyboardType="decimal-pad"
            value={formData.weight}
            onChangeText={(val) => handleInputChange('weight', val)}
            placeholder="Ex: 65,50"
            placeholderTextColor="#888" 
          />

          <GenderSelector
            selectedGender={formData.gender}
            onChange={(gender) => handleInputChange('gender', gender)}
          />

          <View style={styles.bottomButtons}>
            {isModified && (
              <BorderedButton title="SALVAR" onPress={handleSave} />
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: height * 0.04, 
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  scrollViewFlex: {
    flex: 1,
  },
  header: {
    backgroundColor: '#F46F6F',
    height: Platform.OS === 'ios' ? height * 0.12 : height * 0.1, 
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: Platform.OS === 'ios' ? height * 0.05 : height * 0.03, 
    paddingHorizontal: width * 0.05, 
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', 
  },
  backButtonPosition: {
    position: 'absolute',
    left: width * 0.05,
    top: Platform.OS === 'ios' ? height * 0.06 : height * 0.04, 
    zIndex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: width * 0.055, 
    fontWeight: '600',
    textAlign: 'center',
  },
  form: {
    marginTop: height * 0.015, 
    paddingHorizontal: width * 0.05, 
  },
  label: {
    fontWeight: '600',
    fontSize: width * 0.04, 
    marginTop: height * 0.02, 
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    padding: width * 0.03, 
    marginTop: height * 0.008, 
    fontSize: width * 0.04, 
  },
  ageText: {
    marginTop: height * 0.008,
    fontSize: width * 0.035, 
    color: '#666',
  },
  bottomButtons: {
    marginTop: height * 0.04, 
    alignItems: 'center',
  },
});