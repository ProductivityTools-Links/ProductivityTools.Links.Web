import { useEffect, useState } from 'react';
import service from '../../services/api.js'
import Tree from '../Tree/index.js';
import { StyledEngineProvider } from '@mui/material/styles';
import Links from '../Links'


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
            <div style={{ width: '200px', float: 'left' }}>
                    <Tree structure={data}></Tree>
            </div>
            <div>{data && data.id}</div>
       <Links></Links>

        </div>
    )
}

export default Home;