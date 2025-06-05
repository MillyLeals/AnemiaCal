import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions, 
  TouchableOpacity,
  Platform,  
  Alert,     
  KeyboardAvoidingView, 
} from 'react-native';
import { useRouter } from 'expo-router';
import BackButton from '../components/BackButton';
import BorderedButton from '../components/BorderedButton';

// Removidas importações não utilizadas (InfoLinkButton, db, addDoc, collection, Timestamp, getAuth)

const { height, width } = Dimensions.get('window');

export default function CalculadoraEletroforese() {
  const [hbA2, setHbA2] = useState('');
  const [resultado, setResultado] = useState('');
  const router = useRouter();

  const handleCalcular = () => {
    const valor = parseFloat(hbA2.replace(',', '.'));

    if (isNaN(valor)) {
      setResultado('Valor inválido.');
      Alert.alert('Erro', 'Por favor, insira um valor numérico válido para HB A2%.'); 
      return;
    }

    if (valor < 1.5) {
      setResultado('Alfa Talassemia Menor / Beta Atípica');
    } else if (valor >= 1.5 && valor <= 3.5) {
      setResultado('Valor dentro da normalidade');
    } else {
      setResultado('Beta Talassemia Menor');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}> 
        <View style={styles.header}>
          <View style={styles.backButtonPosition}>
            <BackButton />
          </View>
          <Text style={styles.headerTitle}>Calculadora</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.titleBelowContainer}>Eletroforese de Hemoglobina/HPLC</Text>

          <Text style={styles.label}>HB A2%:</Text>
          <TextInput
            style={styles.input}
            value={hbA2}
            onChangeText={setHbA2}
            keyboardType="numeric"
            placeholder="ex: 4.2"
            placeholderTextColor="#888" 
          />

          <View style={styles.centerButton}>
            <BorderedButton title="CALCULAR" onPress={handleCalcular} />
          </View>

          {resultado !== '' && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>RESULTADO:</Text>
              <Text style={styles.resultText}>{resultado}</Text>

              <TouchableOpacity style={styles.saveButton} onPress={() => router.replace('/home')}>
                <Text style={styles.saveButtonText}>HOME</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.legendContainer}>
            <Text style={styles.legendLabel}>Legenda:</Text>
            <Text style={styles.legendText}>HB A2: Hemoglobina A2</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  content: {
    paddingHorizontal: width * 0.05, 
    paddingVertical: height * 0.035, 
  },
  titleBelowContainer: {
    textAlign: 'center',
    fontSize: width * 0.048,
    fontWeight: '700',
    marginBottom: height * 0.035, 
  },
  label: {
    fontWeight: '600',
    fontSize: width * 0.04, 
    marginBottom: height * 0.01, 
    marginTop: height * 0.025, 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: width * 0.03, 
    padding: width * 0.03, 
    fontSize: width * 0.04, 
    marginBottom: height * 0.025, 
  },
  centerButton: {
    marginTop: height * 0.035, 
    alignItems: 'center',
  },
  resultContainer: {
    marginTop: height * 0.035, 
    padding: width * 0.05, 
    backgroundColor: '#ffeaea',
    borderRadius: width * 0.025, 
    borderColor: '#f46f6f',
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  resultLabel: {
    fontSize: width * 0.045, 
    fontWeight: '700',
    marginBottom: height * 0.015, 
    color: '#c62828',
  },
  resultText: {
    fontSize: width * 0.04, 
    color: '#333',
    textAlign: 'left',
    marginBottom: height * 0.01, 
  },
  saveButton: {
    marginTop: height * 0.025,
    backgroundColor: '#f46f6f',
    paddingVertical: height * 0.015, 
    paddingHorizontal: width * 0.05, 
    borderRadius: width * 0.02, 
    alignItems: 'center',
    alignSelf: 'stretch', 
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.04, 
    textTransform: 'uppercase',
  },
  legendContainer: {
    paddingHorizontal: width * 0.0125, 
    marginBottom: height * 0.025, 
    marginTop: height * 0.025, 
  },
  legendLabel: {
    fontWeight: '600',
    marginBottom: height * 0.01, 
    fontSize: width * 0.038, 
  },
  legendText: {
    fontSize: width * 0.035, 
    color: '#666',
  },
});