import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  Alert,        
  TouchableOpacity,
  StyleSheet,
  Dimensions, 
  Platform,   
} from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '../components/CustomButton';

import { auth } from '../lib/firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';

const { height, width } = Dimensions.get('window');

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
    paddingTop: Platform.OS === 'ios' ? height * 0.1 : height * 0.08,
    paddingBottom: height * 0.03,
    paddingHorizontal: width * 0.08, 
    backgroundColor: '#fff',
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: width * 0.035, 
    color: '#555',
    marginTop: height * 0.01, 
  },
  container: {
    flex: 1,
    backgroundColor: '#F46F6F',
    borderTopLeftRadius: width * 0.1, 
    borderTopRightRadius: width * 0.1, 
    paddingHorizontal: width * 0.08, 
    paddingTop: height * 0.07,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: height * 0.055, 
    borderBottomWidth: 1,
    borderColor: '#fff',
    color: '#fff',
    marginBottom: height * 0.05, 
    paddingHorizontal: width * 0.02, 
    fontSize: width * 0.04, 
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: width * 0.05, 
    paddingVertical: height * 0.018, 
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', 
  },
  backLink: {
    color: '#fff',
    fontSize: width * 0.035,
    textDecorationLine: 'underline',
    marginTop: height * 0.02,
  },
});