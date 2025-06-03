import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
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

        resultsList.sort((a, b) => b.data?.seconds - a.data?.seconds);
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
      <View style={styles.center}>
        <Text>Nenhum resultado encontrado para este paciente.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <BackButton />
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

              <Text>
                Valor calculado:{' '}
                {item.ehsani != null
                  ? item.ehsani.toFixed(2)
                  : item.igk != null
                  ? item.igk.toFixed(2)
                  : 'N/A'}
              </Text>

              <Text>{item.interpretacao}</Text>

              <Text style={styles.dateText}>
  Data: {item.data?.toDate?.().toLocaleString?.() ?? 'N/A'}
</Text>
            </View>
          )}
          scrollEnabled={false}
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
  container: {
    paddingBottom: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
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
    flexDirection: 'row',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  resultsWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  resultBox: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#F46F6F',
    borderRadius: 10,
    backgroundColor: '#ffe6e6',
  },
  resultTitle: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 10,
    color: '#b00000',
  },
  dateText: {
    marginTop: 8,
    fontStyle: 'italic',
    color: '#666',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    alignSelf: 'center',
    width: '70%',
    marginTop: 10, 
    marginBottom: 80, 
  },
});
