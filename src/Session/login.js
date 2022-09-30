import { auth, signInWithGoogle } from "./firebase"

export default function Login({ callback }) {


    const signIn = async () => {
        let user = await signInWithGoogle();
        if (user) {
            callback(user);
        }
    }

    return (
        <div className="login">
            <div className="login__container">
                <button className="login__btn login__google" onClick={signIn}>
                    Login with Google
                </button>
            </div>
        </div>
    )
}