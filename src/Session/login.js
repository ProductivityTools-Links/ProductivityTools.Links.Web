import {auth, signInWithGoogle } from "./firebase"

export default function Login(){

    return(
        <div className="login">
        <div className="login__container">
            <button className="login__btn login__google" onClick={signInWithGoogle}>
                Login with Google
            </button>
        </div>
    </div>
    )
}