import { initializeApp } from 'firebase/app';
import { 
  getFirestore
} from 'firebase/firestore';
import { 
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCQpyRB6gbDN9cPb4wSSbvqTp7pyMdOgi8",
  authDomain: "task-manager-app-d23cb.firebaseapp.com",
  projectId: "task-manager-app-d23cb",
  storageBucket: "task-manager-app-d23cb.firebasestorage.com",
  messagingSenderId: "213094359407",
  appId: "1:213094359407:web:b63cda6ca47291f8c1889a"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});