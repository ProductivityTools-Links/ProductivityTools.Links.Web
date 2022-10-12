import { useEffect, useState } from "react";
import service from "../../services/api";
import { auth, logout, tokenExpired } from '../../Session/firebase'
import Login from '../../Session/login'
import Token from '../Token'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Console from "../Console";




function Home() {

    const [accounts, setAccounts] = useState([]);
    const [date, setDate] = useState(new Date().getTime());
    const [tokenExpiredState, setTokenExpiredState] = useState(true);

    useEffect(() => {

        const call = async () => {
            let r = await service.getAccounts();
            setAccounts(r);
            console.log(r);
        }

        call();
    }, [tokenExpiredState])

    const logoutAction = () => {
        console.log("logoutaction")
        logout();
        setDate(new Date().getTime());
    }

    const createAccount = async () => {
        let r = await service.createAccountIfNotExists();
        console.log(r);
    }

    const loginPerformed = () => {
        console.log("Login performed");
        setTokenExpiredState(tokenExpired());
        createAccount();
    }

    if (tokenExpiredState) {
        return (
            <div>
                <Login callback={loginPerformed} />
                <Token date={date} />
                <ToastContainer />
            </div>
        )
    }
    else {
        return (
            <div>
                <p>List of accounts</p>
                {accounts && accounts.map(x => {
                    return (
                        <div key={x.login}><a href={x.login}> {x.login}</a></div>
                    )
                })}
                <div><button onClick={logoutAction}>logout</button></div>
                <Token date={date} />
                <ToastContainer />
            </div>
        )
    }
}

export default Home;