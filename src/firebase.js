import firebase from "firebase";
import "firebase/auth";

const firebaseconfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

firebase.initializeApp(firebaseconfig);

const UsersRef = firebase.database().ref(`users`);

export const fetchRole = (currentUserId) => {
  UsersRef.once("value", (snap) => {
    snap.forEach(function () {
      firebase
        .database()
        .ref(`users`)
        .child(currentUserId)
        .once("value", (snap) => {
          if (snap.val()) return 12;
        });
    });
  });
};

export const auth = firebase.auth();

export default firebase;
