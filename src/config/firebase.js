import { initializeApp } from "firebase/app";
//authentication required
//database access
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC5xOgUAOK1q0BKmUk-OloRmZNVJ8YB_h8",
    authDomain: "blog-app-fd7c4.firebaseapp.com",
    projectId: "blog-app-fd7c4",
    storageBucket: "blog-app-fd7c4.appspot.com",
    messagingSenderId: "522516304591",
    appId: "1:522516304591:web:a9dcf92c0b85a6e3105dba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); //for firestore database