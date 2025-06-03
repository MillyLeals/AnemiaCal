import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { getAuth } from 'firebase/auth';
import logo3 from '../assets/logo3.png';

const { width } = Dimensions.get('window');

type AppRoutes =
  | '/sobre'
  | '/cadastro'
  | '/patient_list'
  | '/calculadora'
  | '/opcoes'
  | '/patient_register';

export default function Home() {
  const router = useRouter();

  // Estado para guardar o nome do usuário
  const [nomeUsuario, setNomeUsuario] = useState<string>('Usuário');

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      // Se o nome existir, atualiza
      if (user.displayName && user.displayName !== '') {
        setNomeUsuario(user.displayName);
      } else {
        // Se o displayName estiver vazio, pode colocar o email como fallback ou algum texto genérico
        setNomeUsuario(user.email?.split('@')[0] || 'Usuário');
      }
    }
  }, []);

  const navigateTo = (route: AppRoutes) => {
    router.push(route as any);
  };

  const atalhos: { icon: string; tooltip: string; route: AppRoutes }[] = [
    { icon: 'information-outline', tooltip: 'Sobre o App', route: '/sobre' },
    { icon: 'account-plus-outline', tooltip: 'Fazer Cadastro', route: '/patient_register' },
    { icon: 'account-group-outline', tooltip: 'Visualizar Pacientes', route: '/patient_list' },
    { icon: 'calculator-variant-outline', tooltip: 'Calculadora', route: '/calculator' },
  ];

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.topContainer}>
        <Text style={styles.welcomeText}>Bem-vindo(a), {nomeUsuario}</Text>

        {/* Ícone de configurações de perfil do lado direito */}
        <TouchableOpacity onPress={() => navigateTo('/opcoes')} style={styles.profileButton}>
          <MaterialCommunityIcons name="account-circle-outline" size={34} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Ícones */}
      <View style={styles.shortcutsContainer}>
        {/* Primeira linha de ícones */}
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => navigateTo('/sobre')}
            style={styles.shortcut}
            accessibilityLabel="Sobre o App"
          >
            <MaterialCommunityIcons name="information-outline" size={50} color="#fff" />
            <Text style={styles.shortcutLabel}>Sobre o App</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigateTo('/patient_register')}
            style={styles.shortcut}
            accessibilityLabel="Fazer Cadastro"
          >
            <MaterialCommunityIcons name="account-plus-outline" size={50} color="#fff" />
            <Text style={styles.shortcutLabel}>Cadastrar</Text>
          </TouchableOpacity>
        </View>

        {/* Segunda linha de ícones */}
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => navigateTo('/patient_list')}
            style={styles.shortcut}
            accessibilityLabel="Visualizar Pacientes"
          >
            <MaterialCommunityIcons name="account-group-outline" size={50} color="#fff" />
            <Text style={styles.shortcutLabel}>Pacientes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigateTo('/calculator')}
            style={styles.shortcut}
            accessibilityLabel="Calculadora"
          >
            <MaterialCommunityIcons name="calculator-variant-outline" size={50} color="#fff" />
            <Text style={styles.shortcutLabel}>Calculadora</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Logo centralizada */}
      <View style={styles.whiteFooterLogoContainer}>
        <Image source={logo3} style={styles.logoImage} resizeMode="contain" />
      </View>

      {/* Rodapé */}
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
    height: 150,
    backgroundColor: '#F46F6F',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 15,
    position: 'relative',
  },
  profileButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  shortcutsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  shortcut: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    height: 130,
    backgroundColor: '#F46F6F',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  shortcutLabel: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  whiteFooterLogoContainer: {
    alignItems: 'center',
    marginVertical: 5,
  },
  logoImage: {
    width: 200,
    height: 200,
  },
  bottomContainer: {
    width: width,
    height: 40,
    backgroundColor: '#F46F6F',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
});


