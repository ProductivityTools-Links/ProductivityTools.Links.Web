import { useEffect, useState } from 'react';
import service from '../../services/api.js'
import Tree from '../Tree/index.js';
import { StyledEngineProvider } from '@mui/material/styles';
import Links from '../Links'


function Home() {

    const [data, setData] = useState(null)
    const [selectedNode, setSelectedNode] = useState();
    // const [filter, setFilter] = useState();
    useEffect(() => {
        const call = async () => {
            let r = await service.getTree();
            console.log(r);
            setData(r)
        }
        call();
    }, [])


    const getFilteredNodes = (nodes, filter) => {
        let result = [];
        for (var i = 0; i < nodes.length; i += 1) {
            if (nodes[i].name.indexOf(filter) > -1) {
                let tempNode = nodes[i];
                tempNode.nodes = getFilteredNodes(tempNode.nodes, filter);
                result.push(tempNode)
            }
        }
        return result;
    }

    const filterData = (filter) => {
        debugger;
        let copyData = { ...data };
        copyData.nodes = getFilteredNodes(data.nodes, filter);
        setData(copyData);
    }

    return (
        <div>
            <div>pawel</div>
            <input onChange={(e) => filterData(e.target.value)}></input>
            {/* <div>{filter}</div> */}
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