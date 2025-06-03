import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebaseConfig'; 
import BackButton from '../components/BackButton/index';
import BorderedButton from '../components/BorderedButton';

const { width } = Dimensions.get('window');

export default function Opcoes() {
  const router = useRouter();

  const [dados, setDados] = useState({
    nome: '',
    email: '',
    profissao: '',
    especialidade: '',
    local: '',
  });
  const [alterado, setAlterado] = useState(false);
  const [loading, setLoading] = useState(true);

  // Buscar dados do usuário no Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          // Usuário não está logado, redireciona para login
          router.replace('/login');
          return;
        }
        const docRef = doc(db, 'profissionais_saude', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as {
            nome: string;
            email: string;
            profissao: string;
            especialidade: string;
            local: string;
          };
          setDados(data);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (campo: string, valor: string) => {
    setDados((prev) => {
      const novoDados = { ...prev, [campo]: valor };
      setAlterado(JSON.stringify(prev) !== JSON.stringify(novoDados));
      return novoDados;
    });
  };

  const handleSalvar = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Erro', 'Usuário não autenticado.');
        return;
      }
      const docRef = doc(db, 'profissionais_saude', user.uid);
      await updateDoc(docRef, dados);
      Alert.alert('Sucesso', 'Dados salvos com sucesso!');
      setAlterado(false);
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    }
  };

  const handleSair = () => {
    Alert.alert(
      'Confirmar Logout',
      'Você tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          onPress: async () => {
            try {
              await auth.signOut();
              router.replace('/');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível sair da conta.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#F46F6F" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dados do Usuário</Text>
        <BackButton style={styles.backIcon} />
      </View>

      <View style={styles.form}>
        {[
          { label: 'Nome Completo', campo: 'nome' },
          { label: 'Email', campo: 'email' },
          { label: 'Profissão', campo: 'profissao' },
          { label: 'Especialidade', campo: 'especialidade' },
          { label: 'Local de Atendimento', campo: 'local' },
        ].map(({ label, campo }) => (
          <View key={campo} style={styles.inputWrapper}>
            <Text style={styles.label}>{label}:</Text>
            <TextInput
              style={styles.input}
              value={dados[campo as keyof typeof dados]}
              onChangeText={(texto) => handleChange(campo, texto)}
              placeholder={label}
              editable={campo !== 'email'}
            />
          </View>
        ))}

        <BorderedButton title="ALTERAR SENHA" onPress={() => router.push('/createNewPassword')} />

        {alterado && <BorderedButton title="SALVAR" onPress={handleSalvar} />}

        <TouchableOpacity onPress={handleSair}>
          <Text style={styles.sairTexto}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width,
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
  form: {
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
  inputWrapper: {
    marginBottom: 18,
    width: '100%',
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
  sairTexto: {
    color: '#004AAD',
    fontSize: 16,
    fontWeight: '500',
    alignSelf: 'flex-end',
    marginTop: 30,
  },
});

