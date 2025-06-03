
// app/_layout.tsx - Ponto de entrada principal para Expo Router
import { useEffect } from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import '../lib/firebaseConfig'; 

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Slot />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}