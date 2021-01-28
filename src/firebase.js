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
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storageRef = firebase.storage().ref();
export async function fetchRole(currentUser) {
  const usersRef = firestore.collection("users").doc(currentUser.uid);
  const doc = await usersRef.get();
  if (!doc.exists) {
    console.log("No such document!");
  } else {
    return doc.data().role;
  }
}

export async function fetchAllCoordinates() {
  const snapshot = await firestore.collection("restaurants").get();
  return snapshot.docs.map((doc) => doc.data().coordinates);
}

export async function fetchResData() {
  const snapshot = await firestore
    .collection("restaurants")
    .orderBy("name")
    .get();
  return snapshot.docs.map((doc) => doc.data());
}

export default firebase;
