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

        var authors = []

        const findAuthorByName = (authorName) => {
            for (var i = 0; i < authors.length; i++) {
                //console.log("findAuthorByNam2e",authorName)
                if (authors[i].name == authorName) {
                    return authors[i]

                }
            }
        }

        const addAuthorLink = (link) => {

            var authorArrayItem = findAuthorByName(link.authors);
            if (!authorArrayItem) {
                authorArrayItem = { _type: "Node", name: link.authors, _id: link.authors, child: [] }
                authors.push(authorArrayItem);
            }
            authorArrayItem.child.push(link);

        }

        const getOwners = (node) => {
            //console.log("getOwners:", node);
            if (node._type == "Link" && node.authors) {
                //console.log("LinkAudthors:", node.authors);
                addAuthorLink(node);
                //console.log("getOwners,authors", authors)
            }

            if (node.child) {
                for (var i = 0; i < node.child.length; i++) {
                    //console.log(node.child[i].name)
                    getOwners(node.child[i])

                }
            }
        }

        const call = async () => {
            let x = navigate;
            let y = location;
            let z = params;
            let treeStructure = await service.getTreeLinks(params.login);
            getOwners(treeStructure);
            console.log("getOwners,authors2", authors)
            let authorsNode = { _type: "Node", name: "Authors", _id: "authors", child: authors }
            treeStructure.child.push(authorsNode)
            console.log("treeStructure.child.push(authors)", treeStructure)
            setTreeLinks(treeStructure);
            setFilteredData(treeStructure);

            if (selectedNode) {
                console.log("findNode", treeStructure, selectedNode);
                var updatedSelected = findNodeById(treeStructure, selectedNode._id)
                console.log("updatedSelected", updatedSelected)
                setSelectedNode(updatedSelected);
            }
            console.log("getTreeLinks", treeStructure);
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

            //this put the whole node with all the childs and links if the name is find in the tree
            if (nodes[i].name.toLowerCase().indexOf(filter.toLowerCase()) > -1) {
                let fullNode = { ...nodes[i] }
                result.push(fullNode)
            
            } else if (tempNode.child && tempNode.child.length > 0) {
                //this line adds only the links
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

    const clearFilterBox = () => {

    }

    return (
        <div>

            <div>
                <a href="/">Home1</a>
                <button onClick={logoutAction}>logout</button>
                <input id="filerField" onChange={(e) => filterData(e.target.value)}></input><button onClick={() => { document.getElementById("filerField").value = ""; filterData("") }}>Clear</button>
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