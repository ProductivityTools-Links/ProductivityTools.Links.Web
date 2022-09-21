import { useEffect, useState } from 'react'
import service from '../../services/api.js'


function Date() {

    const [dt, setDt] = useState();

    useEffect(() => {
        const call = async () => {
            let r = await service.getDate();
            console.log(r);
            setDt(r);
        }
        call();
    }, [])

    return (
        <p>Complex Date{dt}</p>
    )
}

export default Date;