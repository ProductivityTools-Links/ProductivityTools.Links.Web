import { useEffect, useState } from 'react';
import service from '../../services/api.js'
import Tree from '../Tree/index.js';
import { StyledEngineProvider } from '@mui/material/styles';
import Links from '../Links'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { auth, logout } from '../../Session/firebase'
import Login from '../../Session/login'



function Home() {

    const [data, setData] = useState(null)
    const [filteredData, setFilteredData] = useState(null);
    const [selectedNode, setSelectedNode] = useState();
    const [user,setUser]=useState(null);
    // const [filter, setFilter] = useState();
    useEffect(() => {
        const call = async () => {
            let r = await service.getTree();
            console.log(r);
            setData(r);
            setFilteredData(r);
            console.log(r);
            setSelectedNode(r);

        }
        call();
        console.log(auth.currentUser);
        debugger;
    }, [user])


    const getFilteredNodes = (nodes, filter) => {
        let result = [];
        for (var i = 0; i < nodes.length; i += 1) {
            let tempNode = { ...nodes[i] };
            tempNode.nodes = getFilteredNodes(tempNode.nodes, filter);

            if (nodes[i].name.indexOf(filter) > -1 || tempNode.nodes.length > 0) {
                result.push(tempNode)
            }
        }
        return result;
    }

    const filterData = (filter) => {
        setFilteredData(data);
        console.log("filter data")
        if (filter != "") {
            let copyData = { ...data };
            copyData.nodes = getFilteredNodes(data.nodes, filter);
            setFilteredData(copyData);
        }
    }

    const loginAction = () => {
        console.log("loginaction")

    }

    const logoutAction = () => {
        console.log("logoutaction")
        logout();
        setUser(null);
    }

    console.log(auth);
    console.log(auth.currentUser);
    debugger;
    if (!user) {
        return (
            <Login setUser={setUser}/>
        )
    }
    else {


        return (
            <div>
                <div>pawel</div>
                <div><button onClick={loginAction}>login</button></div>
                <div><button onClick={logoutAction}>logout</button></div>
                <input onChange={(e) => filterData(e.target.value)}></input>
                {/* <div>{filter}</div> */}
                <DndProvider backend={HTML5Backend}>
                    <div>selectedNode: {selectedNode && selectedNode.id}</div>
                    <div style={{ width: '200px', float: 'left' }}>
                        <Tree structure={filteredData} setSelectedNode={setSelectedNode} selectedNode={selectedNode}></Tree>
                    </div>
                    <div style={{ float: 'left' }}>
                        <Links selectedNode={selectedNode} />
                    </div>
                </DndProvider>


            </div>
        )
    }
}

export default Home;