import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Omitimos Analytics por simplicidad

const firebaseConfig = {
  apiKey: "AIzaSyAwUkv8NPZAEPZr1S16cqjs6vu0cYxKvvw",
  authDomain: "recetario-familiar-2f899.firebaseapp.com",
  projectId: "recetario-familiar-2f899",
  storageBucket: "recetario-familiar-2f899.firebasestorage.app",
  messagingSenderId: "919935123025",
  appId: "1:919935123025:web:8245bb629a225a339e0270",
  measurementId: "G-R8GXJPSGND"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener instancia de Base de Datos y Almacenamiento
export const db = getFirestore(app);
export const storage = getStorage(app);
