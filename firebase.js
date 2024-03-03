import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyDbZQfryMVhUwI1NA2MNyII8nA2jH5q8pA",
	authDomain: "keepnotes-a65ad.firebaseapp.com",
	projectId: "keepnotes-a65ad",
	storageBucket: "keepnotes-a65ad.appspot.com",
	messagingSenderId: "4178282022",
	appId: "1:4178282022:web:5ad064224299c7720548e7",
};

export const app = initializeApp(firebaseConfig, "keep_notes");
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
