import { useEffect, useState } from 'react';
import service from '../../services/api.js'
import Tree from '../Tree/index.js';
import { StyledEngineProvider } from '@mui/material/styles';
import Links from '../Links'


function Home() {

    const [data, setData] = useState([])
    const [selectedNode, setSelectedNode] = useState();
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
            <div>selectedNode: {selectedNode && selectedNode.id}</div>
            <div style={{ width: '200px', float: 'left' }}>
                <Tree structure={data} setSelectedNode={setSelectedNode} selectedNode={selectedNode}></Tree>
            </div>
            <div style={{ float: 'left' }}>
                <Links selectedNode={selectedNode} />
            </div>


        </div>
    )
}

export default Home;