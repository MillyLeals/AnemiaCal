import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig';
import CustomButton from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const showError = (message: string) => Alert.alert('Erro', message);

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const isValidEmail = (email: string) => emailRegex.test(email);

  const handleLogin = async () => {
    if (!email || !senha) {
      showError('Preencha e-mail e senha');
      return;
    }

    if (!isValidEmail(email)) {
      showError('E-mail inválido');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
      const nomeUsuario = user.displayName || 'Usuário';

      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      router.replace({
        pathname: '/home',
        params: { nome: nomeUsuario },
      });
    } catch (error: any) {
      const messages: Record<string, string> = {
        'auth/user-not-found': 'Usuário não encontrado.',
        'auth/wrong-password': 'Senha incorreta.',
      };
      showError(messages[error.code] || 'Email ou senha inválido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Bem-vindo!</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#fff"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            accessibilityLabel="Campo de e-mail"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Senha"
              secureTextEntry={!showPassword}
              placeholderTextColor="#fff"
              value={senha}
              onChangeText={setSenha}
              accessibilityLabel="Campo de senha"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.showPasswordButton}
              accessibilityLabel={showPassword ? "Esconder senha" : "Mostrar senha"}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.push('/createNewPassword')}>
            <Text style={styles.link}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator size="large" color="#fff" style={styles.loadingIndicator} />
          ) : (
            <CustomButton
              text="ENTRAR"
              onPress={handleLogin}
              disabled={!email || !senha}
              style={styles.button}
            />
          )}
        </View>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Faça seu cadastro</Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.linkHighlight}>clique aqui</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 80,
    paddingBottom: 60,
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#F46F6F',
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    paddingHorizontal: 30,
    paddingTop: 40,
    justifyContent: 'space-between',
  },
  contentWrapper: {
    marginTop: 100,
  },
  input: {
    height: 44,
    borderBottomWidth: 1,
    borderColor: '#fff',
    color: '#fff',
    paddingRight: 40, 
    paddingHorizontal: 8,
    paddingVertical: 10,
    marginBottom: 24,
  },
  passwordContainer: {
    position: 'relative', 
  },
  showPasswordButton: {
    position: 'absolute',
    right: 0,
    bottom: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  link: {
    textAlign: 'right',
    color: '#fff',
    marginBottom: 30,
    fontSize: 12,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
    elevation: 5,
  },
  loadingIndicator: {
    marginBottom: 40,
  },
  registerContainer: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 60,
  },
  registerText: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 2,
  },
  linkHighlight: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
