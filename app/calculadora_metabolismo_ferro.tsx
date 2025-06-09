import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions, 
  Platform,   
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import BackButton from '../components/BackButton';
import BorderedButton from '../components/BorderedButton';

const { height, width } = Dimensions.get('window');

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
    <View style={styles.fullScreenContainer}>
      <View style={styles.header}>
        <View style={styles.backButtonPosition}>
          <BackButton />
        </View>
        <Text style={styles.headerTitle}>Metabolismo de Ferro</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
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

        <View style={styles.buttonContainer}>
          <BorderedButton title="CALCULAR" onPress={calcularResultado} style={styles.buttonFullWidth} /> 
        </View>

        {resultado && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Resultado:</Text>
            <Text style={styles.resultText}>{resultado}</Text>

            <TouchableOpacity style={styles.homeButton} onPress={() => router.replace('/home')}>
              <Text style={styles.homeButtonText}>HOME</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.035,
    paddingBottom: height * 0.04,
    flexGrow: 1,
    backgroundColor: '#fff',
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
    top: Platform.OS === 'ios' ? height * 0.06 : height * 0.03,
    zIndex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: width * 0.06,
    fontWeight: '600',
    textAlign: 'center',
  },
  label: {
    fontSize: width * 0.04,
    fontWeight: '600',
    marginBottom: height * 0.01,
    marginTop: height * 0.025,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: width * 0.025,
    overflow: 'hidden',
    marginBottom: height * 0.015,
  },
  picker: {
    height: height * 0.07,
    width: '100%',
  },
  buttonContainer: {
    marginTop: height * 0.04,
    alignItems: 'center', 
  },
  buttonFullWidth: {
    width: '100%',
  },
  resultContainer: {
    marginTop: height * 0.04,
    padding: width * 0.05,
    backgroundColor: '#ffeaea',
    borderRadius: width * 0.025,
    borderColor: '#f46f6f',
    borderWidth: 1,
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
    marginBottom: height * 0.025,
    lineHeight: width * 0.055,
  },
  homeButton: {
    marginTop: height * 0.025,
    backgroundColor: '#f46f6f',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    borderRadius: width * 0.02,
    alignItems: 'center',
    alignSelf: 'stretch', 
  },
  homeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.04,
    textTransform: 'uppercase',
  },
});