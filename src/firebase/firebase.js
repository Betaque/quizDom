import firebase from 'firebase';

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBuOziZCT7SeauAlLt9481vA-kW4dtwnEY",
//   authDomain: "quizdom-c6035.firebaseapp.com",
//   projectId: "quizdom-c6035",
//   storageBucket: "quizdom-c6035.appspot.com",
//   messagingSenderId: "769970095992",
//   appId: "1:769970095992:web:94634650244c1dbb532a8d",
//   measurementId: "G-KRBXN2Q0RZ"
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = analytics(app);


const firebaseConfig = {
  apiKey: "AIzaSyBuOziZCT7SeauAlLt9481vA-kW4dtwnEY",
  authDomain: "quizdom-c6035.firebaseapp.com",
  projectId: "quizdom-c6035",
  storageBucket: "quizdom-c6035.appspot.com",
  messagingSenderId: "769970095992",
  appId: "1:769970095992:web:94634650244c1dbb532a8d"
};
  
firebase.initializeApp(firebaseConfig);
firebase.analytics();
firebase.auth()

export default firebase;