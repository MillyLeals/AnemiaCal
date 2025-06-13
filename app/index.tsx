import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'; 
import { useRouter } from 'expo-router';

const { height } = Dimensions.get('window'); 

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo3.png')}
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
    paddingVertical: height * 0.05, 
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: height * 0.28, 
    height: height * 0.28, 
    maxHeight: 250, 
    maxWidth: 250,
  },
  bottomBox: {
    backgroundColor: '#F46F6F',
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    paddingHorizontal: 30, 
    paddingVertical: height * 0.05, 
    justifyContent: 'space-around', 
    // flex: 1, //  flex: 1 aqui para ocupar o máximo possível do espaço restante.
  },
  description: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: height * 0.02, 
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.02, 
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