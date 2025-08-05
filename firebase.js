// firebase.js

import { getAuth } from 'firebase/auth';


import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
const firebaseConfig = {
  apiKey: "AIzaSyAuGjpJ4Rsr5-G3gH0CDH5nxKwaBDT_Jng",
  authDomain: "flexifyappreact.firebaseapp.com",
  databaseURL: "https://flexifyappreact-default-rtdb.firebaseio.com",
  projectId: "flexifyappreact",
  storageBucket: "flexifyappreact.firebasestorage.app",
  messagingSenderId: "268546970454",
  appId: "1:268546970454:web:bb55ad6bd12ade5c9efcf7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };
