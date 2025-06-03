import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import BorderedButton from '../components/BorderedButton';
import BackButton from '../components/BackButton';

const { width } = Dimensions.get('window');

export default function Calculator() {
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState('');

  const formatBirthDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 8);
    let formatted = cleaned;

    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
    } else if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }

    setBirthDate(formatted);

    if (formatted.length === 10) {
      const calculatedAge = calculateAge(formatted);
      setAge(String(calculatedAge));
    } else {
      setAge('');
    }
  };

  const calculateAge = (date: string): number => {
    const [day, month, year] = date.split('/');
    const birth = new Date(Number(year), Number(month) - 1, Number(day));
    const today = new Date();
    let diff = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) diff--;
    return diff;
  };

  const handleStartCalculator = () => {
    if (birthDate.length !== 10) {
      alert('Digite a data de nascimento completa no formato DD/MM/AAAA');
      return;
    }

    const calculatedAge = calculateAge(birthDate);
    setAge(String(calculatedAge));

    if (calculatedAge <= 14) {
      router.push('/calculatorEhsani');
    } else {
      router.push('/calculatorIGK');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Calculadoras</Text>
      </View>
      <Text style={styles.infoText}>
        Use as calculadoras sem precisar vincular a um paciente.{"\n"}
        Atenção: dados não são salvos sem cadastro.
      </Text>

      <View style={styles.content}>
        <Text style={styles.label}>Data de Nascimento:</Text>
        <TextInput
          style={styles.input}
          value={birthDate}
          onChangeText={formatBirthDate}
          placeholder="Ex: 15/08/2012"
          keyboardType="numeric"
        />

        {age !== '' && <Text style={styles.ageText}>{age} anos</Text>}

        <View style={styles.buttonContainer}>
          <BorderedButton title="INICIAR CALCULADORA" onPress={handleStartCalculator} />
        </View>

        <View style={styles.linksContainer}>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.push('/calculadora_eletroforese')}
          >
            <Text style={styles.linkText}>Calculadora Eletroforese</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.push('/calculadora_metabolismo_ferro')}
          >
            <Text style={styles.linkText}>Calculadora Metabolismo Ferro</Text>
          </TouchableOpacity>

          
        </View>
      </View>
    </View>
  );
};

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
  infoText: {
  marginTop: 20,
  marginHorizontal: 20,
  textAlign: 'center',
  fontSize: 14,
  color: '#444',
  fontStyle: 'italic',
},
  content: {
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
  ageText: {
    fontStyle: 'italic',
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
  buttonContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  linksContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  linkButton: {
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: '#F46F6F',
    borderRadius: 25,
    width: width * 0.8,
    alignItems: 'center',
  },
  linkText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});


