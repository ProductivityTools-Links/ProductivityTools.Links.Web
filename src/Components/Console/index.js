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
            setFilteredData(r);

            if (selectedNode) {
                console.log("findNode", r, selectedNode);
                var updatedSelected = findNodeById(r, selectedNode._id)
                console.log("updatedSelected", updatedSelected)
                setSelectedNode(updatedSelected);
            }
            console.log("getTreeLinks", r);
        }
        call();
    }, [date])

    const findNodeById = (node, id) => {
        if (node._id == id) {
            return node;
        }
        else {
            if (node.child) {
                for (var i = 0; i < node.child.length; i += 1) {
                    var result = findNodeById(node.child[i], id);
                    if (result) {
                        return result;
                    }
                }
            }
        }
    }

    const getFilteredNodes = (nodes, filter) => {
        let result = [];
        for (var i = 0; i < nodes.length; i += 1) {
            let tempNode = { ...nodes[i] };
            if (tempNode._type == "Node" && tempNode.child) {
                tempNode.child = getFilteredNodes(tempNode.child, filter);
            }

            if (nodes[i].name.toLowerCase().indexOf(filter.toLowerCase()) > -1 || tempNode.child && tempNode.child.length > 0) {
                result.push(tempNode)
            }
        }
        return result;
    }

    const filterData = (filter) => {
        console.log("filter data")
        console.log(treeLinks);
        if (filter != "") {
            let copyData = { ...treeLinks };
            copyData.child = getFilteredNodes(treeLinks.child, filter);
            setFilteredData(copyData);
            console.log("filtered data", copyData)
        }
        else {
            setFilteredData(treeLinks)
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

            <div>
                <a href="/">Home1</a>
                <button onClick={logoutAction}>logout</button>
                <input onChange={(e) => filterData(e.target.value)}></input>
                <span>selectedNode: {selectedNode && selectedNode._id}</span>
            </div>
            <hr />

            {/* <div>{filter}</div> */}
            <DndProvider backend={HTML5Backend}>
                <div style={{ display: 'flex' }}>
                    <div style={{ width: '230px', float: 'left' }}>
                        <Tree structure={filteredData} setSelectedNode={setSelectedNode} selectedNode={selectedNode} refreshTreeLink={refreshTreeLink}></Tree>
                    </div>
                    <div style={{ float: 'left' }}>
                        <Links selectedNode={selectedNode} filteredTreeLinks={treeLinks} refreshTreeLink={refreshTreeLink} />
                    </div>
                </div>
            </DndProvider>
            <Token date={date} />
            <div className='debug'>{params.login} is in the url. {auth?.currentUser?.email} is logged</div>

        </div>
    )
}


export default Console;