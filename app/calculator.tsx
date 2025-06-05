import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import BorderedButton from '../components/BorderedButton'; 
import BackButton from '../components/BackButton';

const { height, width } = Dimensions.get('window');

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
      Alert.alert('Erro', 'Digite a data de nascimento completa no formato DD/MM/AAAA');
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
    <View style={styles.fullScreenContainer}>
      <View style={styles.header}>
        <View style={styles.backButtonPosition}>
          <BackButton />
        </View>
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
          placeholderTextColor="#888"
          keyboardType="numeric"
        />

        {age !== '' && <Text style={styles.ageText}>{age} anos</Text>}

        <View style={styles.buttonContainer}>
          <BorderedButton title="INICIAR CALCULADORA" onPress={handleStartCalculator} style={styles.fullWidthButton} />
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
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
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
  infoText: {
    marginTop: height * 0.025,
    marginHorizontal: width * 0.05,
    textAlign: 'center',
    fontSize: width * 0.038,
    color: '#444',
    fontStyle: 'italic',
  },
  content: {
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
  ageText: {
    fontStyle: 'italic',
    fontSize: width * 0.035,
    marginBottom: height * 0.01,
    color: '#666',
  },
  buttonContainer: {
    marginTop: height * 0.06,
    alignItems: 'center', 
  },
  fullWidthButton: {
    width: '100%', 
  },
  linksContainer: {
    marginTop: height * 0.05,
    alignItems: 'center',
  },
  linkButton: {
    marginVertical: height * 0.012,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.06,
    backgroundColor: '#F46F6F',
    borderRadius: width * 0.06,
    width: width * 0.8,
    alignItems: 'center',
  },
  linkText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: width * 0.042,
  },
});