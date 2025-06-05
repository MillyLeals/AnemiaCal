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
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebaseConfig';
import BackButton from '../components/BackButton/index';
import BorderedButton from '../components/BorderedButton';

const { height, width } = Dimensions.get('window');

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F46F6F" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollViewFill}>
      <View style={styles.header}>
        <View style={styles.backButtonPosition}>
          <BackButton />
        </View>
        <Text style={styles.headerTitle}>Dados do Usuário</Text>
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
              placeholderTextColor="#888"
            />
          </View>
        ))}

        <View style={styles.buttonGroupContainer}>
          <BorderedButton title="ALTERAR SENHA" onPress={() => router.push('/createNewPassword')} style={styles.buttonFullWidth} />

          {alterado && <BorderedButton title="SALVAR" onPress={handleSalvar} style={styles.buttonFullWidth} />}
        </View>

        <TouchableOpacity onPress={handleSair} style={styles.logoutTextContainer}>
          <Text style={styles.sairTexto}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: height * 0.04,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  scrollViewFill: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#F46F6F',
    height: Platform.OS === 'ios' ? height * 0.12 : height * 0.1,
    borderBottomLeftRadius: width * 0.08, 
    borderBottomRightRadius: width * 0.08,
    paddingTop: Platform.OS === 'ios' ? height * 0.05 : height * 0.03,
    paddingHorizontal: width * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
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
  form: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
  },
  inputWrapper: {
    marginBottom: height * 0.02,
    width: '100%', 
  },
  label: {
    fontWeight: '600',
    marginBottom: height * 0.005,
    marginTop: height * 0.015,
    fontSize: width * 0.038,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#888',
    paddingVertical: height * 0.008,
    fontSize: width * 0.04,
  },
  buttonGroupContainer: {
    width: '100%', 
    alignItems: 'center', 
    marginTop: height * 0.03, 
  },
  buttonFullWidth: {
    width: '100%', 
    marginBottom: height * 0.015, 
  },
  logoutTextContainer: {
    width: '100%', 
    alignItems: 'center', 
    marginTop: height * 0.04,
  },
  sairTexto: {
    color: '#004AAD',
    fontSize: width * 0.04,
    fontWeight: '500',
  },
});