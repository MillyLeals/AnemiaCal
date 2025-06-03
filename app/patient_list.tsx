import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
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

  const filteredAndSortedPatients = useMemo(() => {
    return [...patients]
      .filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.cpf.includes(searchTerm)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [patients, searchTerm]);

  const maxPages = Math.ceil(filteredAndSortedPatients.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPatients = filteredAndSortedPatients.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSelectPatient = (id: string) => {
    setSelectedPatientId((prev) => (prev === id ? null : id));
  };

  const handleNextPage = () => {
    if (currentPage < maxPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <View style={styles.screen}>
      <TouchableOpacity onPress={() => router.push('/home')} style={styles.backButton}>
        <Ionicons name="arrow-back" size={32} color="#004AAD" />
      </TouchableOpacity>

      <View style={styles.headerTitleContainer}>
        <Text style={styles.title}>Pacientes Cadastrados</Text>
      </View>

      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/patient_register')}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar paciente"
          placeholderTextColor="#888"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <FlatList
        data={currentPatients}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 140 }}
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
              size={16}
              color={selectedPatientId === item.id ? '#004AAD' : '#ccc'}
              style={{ marginRight: 10 }}
            />
            <View>
              <Text style={styles.patientName}>{item.name}</Text>
              <Text style={styles.patientCPF}>{item.cpf}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: '#666', marginTop: 40 }}>
            {patients.length === 0
              ? 'Nenhum paciente cadastrado.'
              : 'Nenhum paciente encontrado.'}
          </Text>
        }
      />

      <View style={styles.paginationContainer}>
        <TouchableOpacity onPress={handlePreviousPage} disabled={currentPage === 1}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={currentPage === 1 ? '#aaa' : '#004AAD'}
          />
        </TouchableOpacity>
        <Text style={styles.pageNumber}>Página {currentPage}</Text>
        <TouchableOpacity onPress={handleNextPage} disabled={currentPage >= maxPages}>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={currentPage >= maxPages ? '#aaa' : '#004AAD'}
          />
        </TouchableOpacity>
      </View>

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
        style={{ marginBottom: 80 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 45,
    left: 20,
    zIndex: 1,
  },
  headerTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#004AAD',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#004AAD',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    height: 40,
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCard: {
    borderColor: '#004AAD',
    backgroundColor: '#eaf0ff',
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  patientCPF: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
  },
  pageNumber: {
    marginHorizontal: 16,
    fontSize: 16,
    color: '#004AAD',
  },
});
