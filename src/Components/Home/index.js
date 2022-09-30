import { useEffect, useState } from "react";
import service from "../../services/api";
import { auth, logout, tokenExpired } from '../../Session/firebase'
import Login from '../../Session/login'
import Token from '../Token'



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
        loginPerformed();
    }, [])

    const logoutAction = () => {
        console.log("logoutaction")
        logout();
        setDate(new Date().getTime());
    }

    const loginPerformed = () => {
        setTokenExpiredState(tokenExpired());
    }

    if (tokenExpiredState) {
        return (
            <div>
                <Login callback={loginPerformed} />
                <Token date={date} />
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
            </div>
        )
    }
}

export default Home;