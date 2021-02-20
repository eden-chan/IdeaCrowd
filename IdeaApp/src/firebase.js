// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
    apiKey: "AIzaSyCkQysNw9qrFPNLN_Us92avvp4wrlNCQNs",
    authDomain: "uofthacks-c34f2.firebaseapp.com",
    projectId: "uofthacks-c34f2",
    storageBucket: "uofthacks-c34f2.appspot.com",
    messagingSenderId: "562909859695",
    appId: "1:562909859695:web:03870e7cbc381536fca29a",
    measurementId: "G-G6287Q9LWX"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();