import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Dimensions, 
  Platform,  
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '../lib/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import BorderedButton from '../components/BorderedButton';
import BackButton from '../components/BackButton';

type Resultado = {
  id: string;
  ehsani?: number;
  igk?: number;
  interpretacao: string;
  data: any;
};

const { height, width } = Dimensions.get('window');

export default function ResultData() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const patientId = params.patientId as string | undefined;

  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) {
      Alert.alert('Erro', 'ID do paciente não informado.');
      setLoading(false);
      return;
    }

    const fetchResultados = async () => {
      try {
        const q = query(
          collection(db, 'resultados_pacientes'),
          where('patientId', '==', patientId)
        );

        const querySnapshot = await getDocs(q);
        const resultsList: Resultado[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          resultsList.push({
            id: doc.id,
            ehsani: data.ehsani,
            igk: data.igk,
            interpretacao: data.interpretacao,
            data: data.data,
          });
        });

        resultsList.sort((a, b) => (b.data?.seconds || 0) - (a.data?.seconds || 0)); 
        setResultados(resultsList);
      } catch (error) {
        console.error('Erro ao buscar resultados:', error);
        Alert.alert('Erro', 'Não foi possível carregar os resultados.');
      } finally {
        setLoading(false);
      }
    };

    fetchResultados();
  }, [patientId]);

  const handleProximoPress = () => {
    if (resultados.length === 0) {
      Alert.alert('Aviso', 'Nenhum resultado para determinar a próxima tela.');
      return;
    }

    const resultadoAtual = resultados[0];
    const interpretacao = resultadoAtual.interpretacao.toLowerCase();

    if (interpretacao.includes('testes de metabolismo do ferro')) {
      router.push(`/calculadora_metabolismo_ferro?patientId=${patientId}`);
    } else if (
      interpretacao.includes('eletroforese de hemoglobina') ||
      interpretacao.includes('hplc')
    ) {
      router.push(`/calculadora_eletroforese?patientId=${patientId}`);
    } else {
      Alert.alert('Aviso', 'Resultado não corresponde a nenhuma calculadora disponível.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F46F6F" />
      </View>
    );
  }

  if (resultados.length === 0) {
    return (
      <View style={styles.emptyResultsContainer}> 
        <View style={styles.backButtonPosition}>
          <BackButton />
        </View>
        <Text style={styles.headerTitle}>Dados Resultado</Text> 
        <Text style={styles.emptyResultsText}>Nenhum resultado encontrado para este paciente.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}> 
      <View style={styles.header}>
        <View style={styles.backButtonPosition}>
          <BackButton />
        </View>
        <Text style={styles.headerTitle}>Dados Resultado</Text>
      </View>

      <View style={styles.resultsWrapper}>
        <FlatList
          data={resultados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.resultBox}>
              <Text style={styles.resultTitle}>
                {item.ehsani != null ? 'Resultado Ehsani' : 'Resultado IGK'}
              </Text>

              <Text style={styles.resultValueText}>
                Valor calculado:{' '}
                {item.ehsani != null
                  ? item.ehsani.toFixed(2)
                  : item.igk != null
                  ? item.igk.toFixed(2)
                  : 'N/A'}
              </Text>

              <Text style={styles.resultInterpretationText}>{item.interpretacao}</Text>

              <Text style={styles.dateText}>
                Data: {item.data?.toDate?.().toLocaleString?.() ?? 'N/A'}
              </Text>
            </View>
          )}
          scrollEnabled={false} 
          contentContainerStyle={styles.flatListInnerContent} 
        />
      </View>

      <BorderedButton
        title="Próximo"
        onPress={handleProximoPress}
        style={styles.nextButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: { 
    paddingBottom: height * 0.03, 
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
    flexDirection: 'row', 
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
    fontSize: width * 0.055,
    fontWeight: '600',
    textAlign: 'center',
  },
  resultsWrapper: {
    flex: 1, 
    justifyContent: 'center', 
    paddingHorizontal: width * 0.05, 
    marginVertical: height * 0.025, 
  },
  flatListInnerContent: { 
    paddingTop: height * 0.01, 
    paddingBottom: height * 0.01, 
  },
  resultBox: {
    marginBottom: height * 0.02, 
    padding: width * 0.04, 
    borderWidth: 1,
    borderColor: '#F46F6F',
    borderRadius: width * 0.025,
    backgroundColor: '#ffe6e6',
  },
  resultTitle: {
    fontWeight: '700',
    fontSize: width * 0.045, 
    marginBottom: height * 0.012, 
    color: '#b00000',
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
    marginTop: height * 0.005, 
  },
  dateText: {
    marginTop: height * 0.01, 
    fontStyle: 'italic',
    color: '#666',
    fontSize: width * 0.035, 
  },
  center: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', 
  },
  emptyResultsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? height * 0.12 : height * 0.1, 
    paddingHorizontal: width * 0.05,
  },
  emptyResultsText: {
    fontSize: width * 0.045, 
    color: '#666',
    textAlign: 'center',
    marginTop: height * 0.05, 
  },
  nextButton: {
    alignSelf: 'center', 
    width: '70%', 
    marginTop: height * 0.02, 
    marginBottom: height * 0.08, 
  },
});