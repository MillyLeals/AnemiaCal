import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo.png')} // ajuste se necessário
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.bottomBox}>
        <Text style={styles.description}>
          Ferramenta essencial para o controle e análise da anemia em seus pacientes!
        </Text>
        <Text style={styles.loginText}>Faça seu login:</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
          <Text style={styles.buttonText}>ACESSAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
     paddingVertical: 40,
  },
  logoContainer: {
    flex: 2,    
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 220,
    height: 220,
  },
  bottomBox: {
    backgroundColor: '#F46F6F',
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    padding: 30,
    
  },
  description: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#004AAD',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
