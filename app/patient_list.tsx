import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions, 
  Platform, 

} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CustomButton from '../components/CustomButton';

import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../lib/firebaseConfig';

interface Patient {
  id: string;
  name: string;
  cpf: string;
}

const { height, width } = Dimensions.get('window');

const ITEMS_PER_PAGE = 5;

export default function RegisteredPatients() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {
    async function fetchAndAddPatient() {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log('Usuário não autenticado');
          setPatients([]);
          return;
        }

        const pacientesQuery = query(
          collection(db, 'pacientes'),
          where('userId', '==', user.uid)
        );

        const querySnapshot = await getDocs(pacientesQuery);
        const firebasePatients: Patient[] = [];

        querySnapshot.forEach((doc) => {
          firebasePatients.push({
            id: doc.id,
            ...(doc.data() as Omit<Patient, 'id'>),
          });
        });

        if (params?.newPatient) {
          const newPatient: Patient = JSON.parse(params.newPatient as string);

          const index = firebasePatients.findIndex(p => p.id === newPatient.id);
          if (index === -1) {
            firebasePatients.push(newPatient);
          } else {
            firebasePatients[index] = newPatient;
          }
        }

        setPatients(firebasePatients);
      } catch (error) {
        console.error('Erro ao buscar pacientes do Firebase:', error);
      }

    }

    fetchAndAddPatient();
  }, [params?.newPatient]); 

  useEffect(() => {
    setSelectedPatientId(null);
    setCurrentPage(1);
  }, [patients, searchTerm]);

  const filteredPatients = useMemo(() => {
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.cpf.includes(searchTerm)
    );
  }, [patients, searchTerm]); 

  const sortedFilteredPatients = useMemo(() => {
    return [...filteredPatients].sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredPatients]); 

  const maxPages = Math.ceil(sortedFilteredPatients.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const currentPatients = sortedFilteredPatients.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleSelectPatient = (id: string) => {
    setSelectedPatientId((prev) => (prev === id ? null : id));
  };

  const handleNextPage = () => {
    if (currentPage < maxPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleSearchChange = (text: string) => {
    setSearchTerm(text);
    setCurrentPage(1);
  };

  return (
    <View style={styles.screen}>
      <TouchableOpacity onPress={() => router.push('/home')} style={styles.backButton}>
        <Ionicons name="arrow-back" size={width * 0.08} color="#004AAD" /> 
      </TouchableOpacity>

      <View style={styles.headerTitleContainer}>
        <Text style={styles.title}>Pacientes Cadastrados</Text>
      </View>

      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/patient_register')}
        >
          <Ionicons name="add-circle-outline" size={width * 0.05} color="#fff" />
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar paciente"
          placeholderTextColor="#888"
          value={searchTerm}
          onChangeText={handleSearchChange}
        />
      </View>

      <FlatList
        data={currentPatients}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: height * 0.18 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelectPatient(item.id)}
            style={[
              styles.patientCard,
              selectedPatientId === item.id && styles.selectedCard,
            ]}
          >
            <Ionicons
              name="ellipse-outline"
              size={width * 0.04} 
              color={selectedPatientId === item.id ? '#004AAD' : '#ccc'}
              style={styles.radioIcon} 
            />
            <View>
              <Text style={styles.patientName}>{item.name}</Text>
              <Text style={styles.patientCPF}>{item.cpf}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>
            {patients.length === 0
              ? 'Nenhum paciente cadastrado.'
              : 'Nenhum paciente encontrado.'}
          </Text>
        }
      />

      {maxPages > 1 && ( 
        <View style={styles.paginationContainer}>
          <TouchableOpacity onPress={handlePreviousPage} disabled={currentPage === 1}>
            <Ionicons
              name="chevron-back"
              size={width * 0.06} 
              color={currentPage === 1 ? '#aaa' : '#004AAD'}
            />
          </TouchableOpacity>
          <Text style={styles.pageNumber}>
            Página {currentPage} de {maxPages}
          </Text>
          <TouchableOpacity onPress={handleNextPage} disabled={currentPage >= maxPages}>
            <Ionicons
              name="chevron-forward"
              size={width * 0.06} 
              color={currentPage >= maxPages ? '#aaa' : '#004AAD'}
            />
          </TouchableOpacity>
        </View>
      )}

      <CustomButton
        text="CONFIRMAR"
        onPress={() => {
          if (selectedPatientId) {
            const selectedPatient = patients.find(p => p.id === selectedPatientId);
            if (selectedPatient) {
              router.push({
                pathname: '/patient_data',
                params: { patient: JSON.stringify(selectedPatient) },
              });
            }
          }
        }}
        disabled={!selectedPatientId}
        style={{ marginBottom: height * 0.08 }} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    paddingHorizontal: width * 0.05, 
    paddingTop: Platform.OS === 'ios' ? height * 0.08 : height * 0.04,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? height * 0.06 : height * 0.03, 
    left: width * 0.05, 
    zIndex: 1,
  },
  headerTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.04, 
    marginBottom: height * 0.03, 
  },
  title: {
    fontSize: width * 0.06, 
    fontWeight: 'bold',
    color: '#004AAD',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02, 
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#004AAD',
    padding: width * 0.025,
    borderRadius: width * 0.02, 
    marginRight: width * 0.025, 
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: width * 0.015, 
    fontSize: width * 0.035, 
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.03, 
    borderRadius: width * 0.02, 
    borderWidth: 1,
    borderColor: '#ccc',
    height: height * 0.06, 
    fontSize: width * 0.04, 
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: width * 0.04, 
    marginBottom: height * 0.015, 
    borderRadius: width * 0.025, 
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCard: {
    borderColor: '#004AAD',
    backgroundColor: '#eaf0ff',
  },
  radioIcon: {
    marginRight: width * 0.025,
  },
  patientName: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#333',
  },
  patientCPF: {
    fontSize: width * 0.035, 
    color: '#666',
    marginTop: height * 0.005,
  },

  emptyListText: {
    textAlign: 'center',
    color: '#666',
    marginTop: height * 0.05,
    fontSize: width * 0.04,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: height * 0.02, 
    marginBottom: height * 0.02, 
  },
  pageNumber: {
    marginHorizontal: width * 0.04, 
    fontSize: width * 0.04, 
    color: '#004AAD',
  },

  footer: {
    position: 'absolute',
    bottom: height * 0.03, 
    left: width * 0.05,
    right: width * 0.05, 
    zIndex: 10,
  },
});