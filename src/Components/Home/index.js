import { useEffect, useState } from "react";
import service from "../../services/api";

function Home() {

    const [accounts, setAccounts] = useState([]);

    useEffect(() => {

        const call = async () => {
            let r = await service.getAccounts();
            setAccounts(r);
            console.log(r);
        }

        call();

    }, [])

    return (
        <div>
            <p>List of accounts</p>
            {accounts && accounts.map(x => {
                return (
                    <div key={x.login}>{x.login}</div>
                )
            })}

        </div>
    )
}

export default Home;