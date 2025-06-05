import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions, 
  Image,
  Platform,   
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { getAuth } from 'firebase/auth';
import logo3 from '../assets/logo3.png';

const { width, height } = Dimensions.get('window'); 

type AppRoutes =
  | '/sobre'
  | '/cadastro' 
  | '/patient_list'
  | '/calculadora'
  | '/opcoes'
  | '/patient_register';

export default function Home() {
  const router = useRouter();

  const [nomeUsuario, setNomeUsuario] = useState<string>('Usuário');

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      if (user.displayName && user.displayName !== '') {
        setNomeUsuario(user.displayName);
      } else {
        setNomeUsuario(user.email?.split('@')[0] || 'Usuário');
      }
    }
  }, []);

  const navigateTo = (route: '/sobre' | '/patient_register' | '/patient_list' | '/calculator' | '/opcoes') => {
    router.push(route as any);
  };

  const atalhos: { icon: string; tooltip: string; route: '/sobre' | '/patient_register' | '/patient_list' | '/calculator' | '/opcoes' }[] = [
    { icon: 'information-outline', tooltip: 'Sobre o App', route: '/sobre' },
    { icon: 'account-plus-outline', tooltip: 'Fazer Cadastro', route: '/patient_register' },
    { icon: 'account-group-outline', tooltip: 'Visualizar Pacientes', route: '/patient_list' },
    { icon: 'calculator-variant-outline', tooltip: 'Calculadora', route: '/calculator' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.welcomeText}>Bem-vindo(a), {nomeUsuario}</Text>

        <TouchableOpacity onPress={() => navigateTo('/opcoes')} style={styles.profileButton}>
          <MaterialCommunityIcons name="account-circle-outline" size={width * 0.09} color="#fff" /> 
        </TouchableOpacity>
      </View>

      <View style={styles.shortcutsContainer}>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => navigateTo('/sobre')}
            style={styles.shortcut}
            accessibilityLabel="Sobre o App"
          >
            <MaterialCommunityIcons name="information-outline" size={width * 0.12} color="#fff" /> 
            <Text style={styles.shortcutLabel}>Sobre o App</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigateTo('/patient_register')}
            style={styles.shortcut}
            accessibilityLabel="Fazer Cadastro"
          >
            <MaterialCommunityIcons name="account-plus-outline" size={width * 0.12} color="#fff" /> 
            <Text style={styles.shortcutLabel}>Cadastrar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => navigateTo('/patient_list')}
            style={styles.shortcut}
            accessibilityLabel="Visualizar Pacientes"
          >
            <MaterialCommunityIcons name="account-group-outline" size={width * 0.12} color="#fff" /> 
            <Text style={styles.shortcutLabel}>Pacientes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigateTo('/calculator')}
            style={styles.shortcut}
            accessibilityLabel="Calculadora"
          >
            <MaterialCommunityIcons name="calculator-variant-outline" size={width * 0.12} color="#fff" /> 
            <Text style={styles.shortcutLabel}>Calculadora</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.whiteFooterLogoContainer}>
        <Image source={logo3} style={styles.logoImage} resizeMode="contain" />
      </View>

      <View style={styles.bottomContainer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topContainer: {
    width: width, 
    height: height * 0.2, 
    backgroundColor: '#F46F6F',
    borderBottomLeftRadius: width * 0.08, 
    borderBottomRightRadius: width * 0.08,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: height * 0.02, 
    position: 'relative',
  },
  profileButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? height * 0.05 : height * 0.02, 
    right: width * 0.05, 
    zIndex: 10,
  },
  welcomeText: {
    color: '#fff',
    fontSize: width * 0.05, 
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: height * 0.01, 
  },
  shortcutsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05, 
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: height * 0.04,
  },
  shortcut: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.4,
    height: height * 0.16, 
    backgroundColor: '#F46F6F',
    borderRadius: width * 0.05, 
    padding: width * 0.05, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: height * 0.005 }, 
    shadowOpacity: 0.3,
    shadowRadius: width * 0.015, 
  },
  shortcutLabel: {
    color: '#fff',
    marginTop: height * 0.01, 
    fontSize: width * 0.04,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  whiteFooterLogoContainer: {
    alignItems: 'center',
    marginVertical: height * 0.005, 
  },
  logoImage: {
    width: width * 0.5,
    height: height * 0.15, 
  },
  bottomContainer: {
    width: width,
    height: height * 0.05, 
    backgroundColor: '#F46F6F',
    borderTopLeftRadius: width * 0.08, 
    borderTopRightRadius: width * 0.08, 
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
  },
});