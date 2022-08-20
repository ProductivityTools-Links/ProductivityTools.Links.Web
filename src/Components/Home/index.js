import { useEffect, useState } from 'react';
import service from '../../services/api.js'

function Home() {

    const [data, setData] = useState([])
    useEffect(() => {
        const call = async () => {
            let r = await service.getTree();
            console.log(r);
            setData(r)
        }
        call();
    }, [])

    return (
        <div>
            <div>pawel</div>
            <div>{data && data.id}</div>
            <div>
                {data  && data.nodes && data.nodes.map(x => {
                    return (<p>{x.name}</p>)
                })
                }
            </div>
        </div>
    )
}

export default Home;