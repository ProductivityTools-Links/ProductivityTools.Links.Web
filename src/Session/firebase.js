import { initializeApp } from "firebase/app";

import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signOut,
} from "firebase/auth";

const devfirebaseConfig = {
    apiKey: "AIzaSyAKD7AagdCuXkEtc_IG8MQGwOfhiqLZohw",
    authDomain: "ptlinksprod.firebaseapp.com",
    projectId: "ptlinksprod",
    storageBucket: "ptlinksprod.appspot.com",
    messagingSenderId: "488456392633",
    appId: "1:488456392633:web:f2b83882cb3b34a3a9b068"
};

const prodfirebaseConfig = {
    apiKey: "AIzaSyAKD7AagdCuXkEtc_IG8MQGwOfhiqLZohw",
    authDomain: "ptlinksprod.firebaseapp.com",
    projectId: "ptlinksprod",
    storageBucket: "ptlinksprod.appspot.com",
    messagingSenderId: "488456392633",
    appId: "1:488456392633:web:f2b83882cb3b34a3a9b068"
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
        return res.user;
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const logout = () => {
    signOut(auth);
    localStorage.removeItem("token")
};

const getToken=()=>{
    let token = localStorage.getItem('token');
    return token;
}

export {
    auth,
    signInWithGoogle,
    logout,
    getToken
};