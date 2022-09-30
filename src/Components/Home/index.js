import { useEffect, useState } from "react";
import service from "../../services/api";
import { auth, logout, getToken } from '../../Session/firebase'
import Login from '../../Session/login'



function Home() {

    const [accounts, setAccounts] = useState([]);
    const [user, setUser] = useState(null);


    const [token, setToken] = useState();

    useEffect(() => {

        const call = async () => {
            let r = await service.getAccounts();
            setAccounts(r);
            console.log(r);
        }

        call();

        const token = async () => {
            let token = getToken();
            setToken(token);
        }

        token();

    }, [])



    console.log(auth);
    console.log(auth.currentUser);

    if (!user) {
        return (
            <div>
                <Login setUser={setUser} />
                <p>Token: {token}</p>
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
                <p>Token: {token}</p>
            </div>
        )
    }
}

export default Home;