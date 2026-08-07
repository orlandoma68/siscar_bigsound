// importar funciones
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from "firebase/firestore" //para base de datos metodo

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain:import.meta.env.VITE_FIREBASE_AUTDOMAIN,
  projectId:import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket:import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId:import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId:import.meta.env.VITE_FIREBASE_APPID,
  measurementId:import.meta.env.VITE_FIREBASE_MEASUREMENTID

}
// inicializar Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)

