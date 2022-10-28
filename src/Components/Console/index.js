import { useEffect, useState, } from 'react';
import {
    useParams,
    useNavigate,
    useLocation,
} from "react-router-dom";
import service from '../../services/api.js'
import Tree from '../Tree/index.js';
import { StyledEngineProvider } from '@mui/material/styles';
import Links from '../Links'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { auth, logout, getToken } from '../../Session/firebase'
import Token from '../Token'




function Console(props) {
    let navigate = useNavigate();
    let location = useLocation();
    let params = useParams();

    const [data, setData] = useState(null)
    const [filteredData, setFilteredData] = useState(null);
    const [selectedNode, setSelectedNode] = useState();

    const [date, setDate] = useState(new Date().getTime());

    const [treeLinks, setTreeLinks] = useState(null);
    const [filteredTreeLinks, setFilteredTreeLinks] = useState(null);


    // const [filter, setFilter] = useState();
    // useEffect(() => {
    //     const call = async () => {
    //         let r = await service.getTree();
    //         console.log(r);
    //         setData(r);
    //         setFilteredData(r);
    //         console.log(r);
    //         setSelectedNode(r);
    //     }
    //     call();

    // }, [])

    // const [filter, setFilter] = useState();
    useEffect(() => {
        const call = async () => {
            let x = navigate;
            let y = location;
            let z = params;
            let r = await service.getTreeLinks(params.login);
            setTreeLinks(r);
            setFilteredTreeLinks(r);
            console.log(r);
        }
        call();
    }, [date])



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
        setDate(new Date().getTime());
    }

    const refreshTreeLink = () => {
        setDate(new Date().getTime());
    }

    return (
        <div>
            <div>{params.login} is in the url. {auth?.currentUser?.email} is logged</div>

            <div><a href="/">Home</a><button onClick={logoutAction}>logout</button></div>
            <input onChange={(e) => filterData(e.target.value)}></input>
            {/* <div>{filter}</div> */}
            <DndProvider backend={HTML5Backend}>
                <div>selectedNode: {selectedNode && selectedNode.id}</div>
                <div style={{display:'flex'}}> 
                    <div style={{ width: '230px', float: 'left' }}>
                        <Tree structure={filteredTreeLinks} setSelectedNode={setSelectedNode} selectedNode={selectedNode}></Tree>
                    </div>
                    <div style={{ float: 'left' }}>
                        <Links selectedNode={selectedNode} filteredTreeLinks={filteredTreeLinks} refreshTreeLink={refreshTreeLink} />
                    </div>
                </div>
            </DndProvider>
            <Token date={date} />
        </div>
    )
}


export default Console;