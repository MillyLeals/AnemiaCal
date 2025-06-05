import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView,
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
  Dimensions, 
} from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebaseConfig';

const { height, width } = Dimensions.get('window');

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    profissao: '',
    especialidade: '',
    local: '',
    telefone: '',
    senha: '',
    confirmarSenha: ''
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatPhone = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length <= 2) {
      return `(${cleaned}`;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    } else if (cleaned.length <= 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    } else {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    }
  };

  const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRegister = async () => {
    const { nome, email, profissao, especialidade, local, telefone, senha, confirmarSenha } = formData;

    if (!nome || !email || !profissao || !senha || !confirmarSenha) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios (*)');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Erro', 'E-mail inválido.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
      const uid = user.uid;

      await updateProfile(user, { displayName: nome });

      await setDoc(doc(db, 'profissionais_saude', uid), {
        uid,
        nome,
        email,
        profissao,
        especialidade,
        local,
        telefone,
        criadoEm: new Date().toISOString(),
      });

      setLoading(false);
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      router.replace('/login');
    } catch (error: any) {
      setLoading(false);
      let message = 'Erro ao cadastrar usuário.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'Este e-mail já está em uso.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'E-mail inválido.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Senha fraca. Use ao menos 6 caracteres.';
      }
      Alert.alert('Erro', message);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? height * 0.1 : 0} 
      >
        <View style={styles.header}>
          <Text style={styles.title}>Crie sua conta</Text>
        </View>

        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <TextInput
              style={styles.input}
              placeholder="Nome completo *"
              placeholderTextColor="#fff"
              onChangeText={text => handleChange('nome', text)}
              value={formData.nome}
            />
            <TextInput
              style={styles.input}
              placeholder="E-mail *"
              placeholderTextColor="#fff"
              keyboardType="email-address"
              onChangeText={text => handleChange('email', text)}
              value={formData.email}
            />
            <TextInput
              style={styles.input}
              placeholder="Profissão *"
              placeholderTextColor="#fff"
              onChangeText={text => handleChange('profissao', text)}
              value={formData.profissao}
            />
            <TextInput
              style={styles.input}
              placeholder="Especialidade"
              placeholderTextColor="#fff"
              onChangeText={text => handleChange('especialidade', text)}
              value={formData.especialidade}
            />
            <TextInput
              style={styles.input}
              placeholder="Local de atendimento"
              placeholderTextColor="#fff"
              onChangeText={text => handleChange('local', text)}
              value={formData.local}
            />
            <TextInput
              style={styles.input}
              placeholder="Telefone (opcional)"
              placeholderTextColor="#fff"
              keyboardType="phone-pad"
              onChangeText={text => handleChange('telefone', formatPhone(text))}
              value={formData.telefone}
            />
            <TextInput
              style={styles.input}
              placeholder="Senha *"
              placeholderTextColor="#fff"
              secureTextEntry
              onChangeText={text => handleChange('senha', text)}
              value={formData.senha}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmar senha *"
              placeholderTextColor="#fff"
              secureTextEntry
              onChangeText={text => handleChange('confirmarSenha', text)}
              value={formData.confirmarSenha}
            />

            {loading ? (
              <ActivityIndicator size="large" color="#fff" style={styles.loadingIndicator} />
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>CADASTRAR</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backLink}>Voltar para o login</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingTop: Platform.OS === 'ios' ? height * 0.1 : height * 0.08, 
    paddingBottom: height * 0.08, 
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.08, 
  },
  title: {
    fontSize: width * 0.07, 
    fontWeight: 'bold',
    color: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#F46F6F',
    borderTopLeftRadius: width * 0.1, 
    borderTopRightRadius: width * 0.1,
    paddingHorizontal: width * 0.08, 
    paddingTop: height * 0.05, 
  },
  scrollContent: {
    paddingBottom: height * 0.05, 
  },
  input: {
    height: height * 0.055, 
    borderBottomWidth: 1,
    borderColor: '#fff',
    color: '#fff',
    marginBottom: height * 0.03, 
    paddingHorizontal: width * 0.02, 
    paddingVertical: height * 0.01, 
    fontSize: width * 0.04, 
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: width * 0.05,
    paddingVertical: height * 0.018,
    alignItems: 'center',
    marginTop: height * 0.025,
    elevation: 5,
    width: '100%', 
  },
  buttonText: {
    color: '#004AAD',
    fontWeight: 'bold',
    fontSize: width * 0.042, 
  },
  backLink: {
    textAlign: 'center',
    color: '#fff',
    fontSize: width * 0.035,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginTop: height * 0.03, 
  },
  loadingIndicator: {
    marginTop: height * 0.025, 
    marginBottom: height * 0.03, 
  },
});