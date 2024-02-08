import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCwZCnAJ4IvkADJwN4Yqcq2gnvIo-j9w78",
  authDomain: "gym-app-59167.firebaseapp.com",
  projectId: "gym-app-59167",
  storageBucket: "gym-app-59167.appspot.com",
  messagingSenderId: "88723988527",
  appId: "1:88723988527:web:bd5b1ddc08ebd7bacae6da",
  measurementId: "G-C2NP8BD3YT"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
