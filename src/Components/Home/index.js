import { useEffect, useState } from "react";
import service from "../../services/api";
import { auth, logout, getToken } from '../../Session/firebase'
import Login from '../../Session/login'
import Token from '../Token'



function Home() {

    const [accounts, setAccounts] = useState([]);
    const [user, setUser] = useState(null);


    const [date, setDate] = useState(new Date().getTime());

    useEffect(() => {

        const call = async () => {
            let r = await service.getAccounts();
            setAccounts(r);
            console.log(r);
        }

        call();
    }, [])

    const logoutAction = () => {
        console.log("logoutaction")
        logout();
        setDate(new Date().getTime());
    }

    if (!user) {
        return (
            <div>
                <Login setUser={setUser} />
                <Token />
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