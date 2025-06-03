import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import BackButton from '../components/BackButton';

export default function CalculadoraMetabolismoFerro() {
  const router = useRouter();

  const [ferro, setFerro] = useState<string>('N');
  const [ferritina, setFerritina] = useState<string>('N');
  const [resultado, setResultado] = useState<string | null>(null);

  const calcularResultado = () => {
  if (ferro === '↓' && ferritina === '↓') {
    setResultado('Anemia Ferropriva / Deficiência de Ferro');
  } else if (ferro === 'N' && ferritina === '↓') {
    setResultado('Possível Deficiência de Ferro');
  } else if (ferro === '↓' && (ferritina === 'N' || ferritina === '↑')) {
    setResultado('Possível Anemia de Doenças Crônicas');
  } else if (ferro === 'N' && ferritina === 'N') {
    setResultado('Possível Anemia de Doenças Crônicas');
  } else if (ferro === 'N' && ferritina === '↑') {
    setResultado('Anemia de Doenças Crônicas / Sideroblástica');
  } else if (ferro === '↑') {
    setResultado('Não cabe com o algoritmo aplicado');
  } else {
    setResultado('Resultado não identificado');
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Metabolismo de Ferro</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Ferro:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={ferro}
            style={styles.picker}
            onValueChange={(itemValue) => setFerro(itemValue)}
          >
            <Picker.Item label="↓ (Baixo)" value="↓" />
            <Picker.Item label="N (Normal)" value="N" />
            <Picker.Item label="↑ (Alto)" value="↑" />
          </Picker>
        </View>

        <Text style={styles.label}>Ferritina:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={ferritina}
            style={styles.picker}
            onValueChange={(itemValue) => setFerritina(itemValue)}
          >
            <Picker.Item label="↓ (Baixo)" value="↓" />
            <Picker.Item label="N (Normal)" value="N" />
            <Picker.Item label="↑ (Alto)" value="↑" />
          </Picker>
        </View>

        <View style={styles.button}>
          <TouchableOpacity style={styles.saveButton} onPress={calcularResultado}>
            <Text style={styles.saveButtonText}>CALCULAR</Text>
          </TouchableOpacity>
        </View>

        {resultado && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Resultado:</Text>
            <Text style={styles.resultText}>{resultado}</Text>

            <TouchableOpacity style={styles.saveButton} onPress={() => router.replace('/home')}>
              <Text style={styles.saveButtonText}>HOME</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  picker: {
    height: 60,
    width: '100%',
  },
  button: {
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
  },
  resultLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#c62828',
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
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
});
