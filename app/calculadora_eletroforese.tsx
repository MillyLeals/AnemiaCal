import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import BackButton from '../components/BackButton';
import BorderedButton from '../components/BorderedButton';

export default function CalculadoraEletroforese() {
  const [hbA2, setHbA2] = useState('');
  const [resultado, setResultado] = useState('');
  const router = useRouter();

  const handleCalcular = () => {
    const valor = parseFloat(hbA2.replace(',', '.'));

    if (isNaN(valor)) {
      setResultado('Valor inválido.');
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
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <BackButton />
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
  content: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  titleBelowContainer: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 30,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 10,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  centerButton: {
    marginTop: 30,
    alignItems: 'center',
  },
  resultContainer: {
  marginTop: 30,
  padding: 20,
  backgroundColor: '#ffeaea',
  borderRadius: 10,
  borderColor: '#f46f6f',
  borderWidth: 1,
  alignItems: 'flex-start',
},
resultLabel: {
  fontSize: 18,
  fontWeight: '700',
  marginBottom: 15,
  color: '#c62828',
},
resultText: {
  fontSize: 16,
  color: '#333',
  textAlign: 'left',
  marginBottom: 10,
},
saveButton: {
  marginTop: 20,
  backgroundColor: '#f46f6f',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 8,
  alignItems: 'center',
  alignSelf: 'stretch',
},
saveButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
  textTransform: 'uppercase',
},
  legendContainer: {
    paddingHorizontal: 5,
    marginBottom: 20,
    marginTop: 20,
  },
  legendLabel: {
    fontWeight: '600',
    marginBottom: 10,
    fontSize: 15,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },
});

