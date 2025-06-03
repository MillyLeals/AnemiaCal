// src/config/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyCfNpw0wke11sbA7MvQzsM-3P4sEEwgTvs',
  authDomain: 'anemiacal-e3c1a.firebaseapp.com',
  projectId: 'anemiacal-e3c1a',
  storageBucket: 'anemiacal-e3c1a.appspot.com',
  messagingSenderId: '445032872299',
  appId: '1:445032872299:web:135fa8d0b29a86bac1b42e',
};

// Inicializa o app
const app = initializeApp(firebaseConfig);

// Inicializa a autenticação e o Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
