import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '../components/CustomButton';

import { auth } from '../lib/firebaseConfig'; 
import { sendPasswordResetEmail } from 'firebase/auth';

export default function CreateNewPasswordScreen() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    if (!isValidEmail(email)) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Sucesso', `E-mail para redefinição enviado para ${email}`);
      router.push('/login');
    } catch (error: any) {
      let message = 'Erro ao tentar enviar e-mail de redefinição.';
      if (error.code === 'auth/user-not-found') {
        message = 'Usuário não encontrado para este e-mail.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'E-mail inválido.';
      }
      Alert.alert('Erro', message);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Redefinir Senha</Text>
        <Text style={styles.subtitle}>
          Digite o e-mail da conta para redefinir sua senha
        </Text>
      </View>

      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#fff"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <CustomButton
          text="ENVIAR E-MAIL"
          onPress={handleResetPassword}
          disabled={!isValidEmail(email)}
          style={styles.button}
        />

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Voltar para login</Text>
        </TouchableOpacity>
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
    paddingBottom: 30,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#F46F6F',
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    paddingHorizontal: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 44,
    borderBottomWidth: 1,
    borderColor: '#fff',
    color: '#fff',
    marginBottom: 40,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  backLink: {
    color: '#fff',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
