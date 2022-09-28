import { initializeApp } from "firebase/app";

import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signOut,
} from "firebase/auth";

const devfirebaseConfig = {
    apiKey: "AIzaSyAxi8kuV5eGHQryz8RTmJrq6LNDk65Gbwk",
    authDomain: "pttechbricksprod.firebaseapp.com",
    projectId: "pttechbricksprod",
    storageBucket: "pttechbricksapi-347809.appspot.com",
    messagingSenderId: "209178581855",
    appId: "1:209178581855:web:3b4141de71f0f6634a74ea"
};

const prodfirebaseConfig = {
    apiKey: "AIzaSyAxi8kuV5eGHQryz8RTmJrq6LNDk65Gbwk",
    authDomain: "pttechbricksprod.firebaseapp.com",
    projectId: "pttechbricksprod",
    storageBucket: "pttechbricksprod.appspot.com",
    messagingSenderId: "211819962172",
    appId: "1:211819962172:web:b11f994d6d86dec2d2c839"
};


// Initialize Firebase
const configName=process.env.NODE_ENV === 'development' ? devfirebaseConfig : prodfirebaseConfig;
const app = initializeApp(configName);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        console.log(res);
        localStorage.setItem("token", res.user.accessToken);

        console.log("token validation");
        let token = localStorage.getItem('token');
        console.log("token from localstorage", token);
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const logout = () => {
    signOut(auth);
    localStorage.removeItem("token")
};


export {
    auth,
    signInWithGoogle,
    logout,
};