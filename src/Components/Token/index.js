import { useEffect, useState } from "react";
import { auth, logout, getToken } from '../../Session/firebase'


function Token({ date }) {

    const [token, setToken] = useState();

    useEffect(() => {
        const token = async () => {
            let token = getToken();
            setToken(token);
        }

        token();
    }, [date])

    return (
        <div>
            <div>TokenXX: {token}</div>
            <div>date: {date}</div>
        </div>
    )
}

export default Token;