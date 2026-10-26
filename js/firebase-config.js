// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnxp21bDapDznvZON2CtMQn3SoANCK6xA",
  authDomain: "ulttyq-kiim-7ee24.firebaseapp.com",
  databaseURL: "https://ulttyq-kiim-7ee24-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ulttyq-kiim-7ee24",
  storageBucket: "ulttyq-kiim-7ee24.firebasestorage.app",
  messagingSenderId: "13055838543",
  appId: "1:13055838543:web:89b92b913a0630d3f19d3a",
  measurementId: "G-1M32KNDZMQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
