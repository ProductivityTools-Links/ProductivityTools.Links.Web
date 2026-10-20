import { useEffect, useState, useCallback, useRef } from 'react';
import {
    useParams,
    useNavigate,
    useLocation,
} from "react-router-dom";
import service from '../../services/api.js'
import Tree from '../Tree/index.js';
import { StyledEngineProvider } from '@mui/material/styles';
import Links from '../Links'
import { parseAuthors } from '../Links/authorsUtils.js'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { auth, logout, getToken } from '../../Session/firebase'
import Token from '../Token'
import './index.css'




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
    const [filterInput, setFilterInput] = useState('');
    const [filter, setFilter] = useState('');
    const [linkMode, setLinkMode] = useState('list');
    const [selectedLink, setSelectedLink] = useState(null);
    const [includeArchived, setIncludeArchived] = useState(false);
    const [existingAuthors, setExistingAuthors] = useState([]);
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
            const lowerName = authorName.toLowerCase();
            for (var i = 0; i < authors.length; i++) {
                //console.log("findAuthorByNam2e",authorName)
                if (authors[i].name.toLowerCase() === lowerName) {
                    return authors[i]

                }
            }
        }

        const addAuthorLink = (link) => {
            const parsedAuthors = parseAuthors(link.authors);
            for (let i = 0; i < parsedAuthors.length; i++) {
                const authorName = parsedAuthors[i];
                var authorArrayItem = findAuthorByName(authorName);
                if (!authorArrayItem) {
                    authorArrayItem = { _type: "Node", name: authorName, _id: authorName, isVirtual: true, child: [] }
                    authors.push(authorArrayItem);
                }
                if (!authorArrayItem.child.some(existing => existing && existing._id === link._id)) {
                    authorArrayItem.child.push(link);
                }
            }
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
            let treeStructure = await service.getTreeLinks(params.login, includeArchived);
            getOwners(treeStructure);
            authors.sort((a, b) => a.name.localeCompare(b.name));
            setExistingAuthors(authors.map(a => a.name));
            console.log("getOwners,authors2", authors)
            let authorsNode = { _type: "Node", name: "Authors", _id: "authors", isVirtual: true, child: authors }
            treeStructure.child.push(authorsNode)
            console.log("treeStructure.child.push(authors)", treeStructure)
            setTreeLinks(treeStructure);
            if (filterInput && filterInput.trim() !== '') {
                let copyData = { ...treeStructure };
                copyData.child = getFilteredNodes(treeStructure.child, filterInput.trim());
                setFilteredData(copyData);
                if (selectedNode && selectedNode._id !== treeStructure._id) {
                    var updatedSelected = findNodeById(copyData, selectedNode._id);
                    setSelectedNode(updatedSelected || copyData);
                } else {
                    setSelectedNode(copyData);
                }
            } else {
                setFilteredData(treeStructure);
                if (selectedNode && selectedNode._id !== treeStructure._id) {
                    var updatedSelected = findNodeById(treeStructure, selectedNode._id);
                    setSelectedNode(updatedSelected || treeStructure);
                } else {
                    setSelectedNode(treeStructure);
                }
            }
            console.log("getTreeLinks", treeStructure);
        }
        call();
    }, [date, includeArchived, params.login])

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

    const getFilteredNodes = (nodes, filterText) => {
        if (!nodes || !filterText) return [];
        const lowerFilter = filterText.toLowerCase();

        const filterHelper = (list) => {
            let result = [];
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                if (!item) continue;

                // Skip the virtual "Authors" branch during tree filtering
                if (item._id === "authors" || item.name === "Authors") continue;

                const nameMatch = item.name && item.name.toLowerCase().includes(lowerFilter);

                if (item._type === "Node") {
                    if (nameMatch) {
                        // Matching node: keep full node with all its children/links
                        result.push(item);
                    } else if (item.child && item.child.length > 0) {
                        const filteredChildren = filterHelper(item.child);
                        if (filteredChildren.length > 0) {
                            result.push({ ...item, child: filteredChildren });
                        }
                    }
                } else if (item._type === "Link") {
                    const authorMatch = parseAuthors(item.authors).some(a => a.toLowerCase().includes(lowerFilter));
                    const linkMatch = nameMatch ||
                        authorMatch ||
                        (item.description && item.description.toLowerCase().includes(lowerFilter)) ||
                        (item.url && item.url.toLowerCase().includes(lowerFilter));
                    if (linkMatch) {
                        result.push(item);
                    }
                }
            }
            return result;
        };

        return filterHelper(nodes);
    }

    const prevFilterInputRef = useRef('');

    const applyFilter = useCallback((filterValue) => {
        const trimmed = filterValue ? filterValue.trim() : '';
        setFilter(trimmed);
        if (trimmed !== "" && treeLinks) {
            let copyData = { ...treeLinks };
            copyData.child = getFilteredNodes(treeLinks.child, trimmed);
            setFilteredData(copyData);
            setSelectedNode(copyData);
        }
        else if (treeLinks) {
            setFilteredData(treeLinks);
            setSelectedNode(treeLinks);
        }
    }, [treeLinks]);

    useEffect(() => {
        if (!treeLinks) return;
        if (prevFilterInputRef.current === filterInput) return;
        prevFilterInputRef.current = filterInput;
        const timer = setTimeout(() => {
            applyFilter(filterInput);
        }, 120);
        return () => clearTimeout(timer);
    }, [filterInput, treeLinks, applyFilter]);

    const clearFilter = useCallback(() => {
        prevFilterInputRef.current = '';
        setFilterInput('');
        setFilter('');
        if (treeLinks) {
            setFilteredData(treeLinks);
            setSelectedNode(treeLinks);
        }
    }, [treeLinks]);

    const loginAction = () => {
        console.log("loginaction")

    }

    const logoutAction = () => {
        console.log("logoutaction")
        logout();
        setDate(new Date().getTime());
    }

    const refreshTreeLink = useCallback(() => {
        setDate(new Date().getTime());
    }, []);

    const clearFilterBox = () => {

    }

    return (
        <div className="console-layout">
            <header className="console-topbar">
                <a href="/" className="console-brand">
                    <img src="/icons/icon-512.png" alt="ProductivityTools.Links" className="console-brand-logo" />
                    <span>ProductivityTools.Links</span>
                    <span style={{ fontSize: '11px', color: '#16a34a', backgroundColor: '#dcfce7', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>v2026.10.20-authors</span>
                </a>

                <div className="console-search-bar">
                    <div className="console-search-input-wrapper">
                        <input
                            id="filerField"
                            className="console-search-input"
                            value={filterInput}
                            placeholder="Filter..."
                            onChange={(e) => setFilterInput(e.target.value)}
                        />
                    </div>
                    <button className="console-btn" onClick={clearFilter}>Clear</button>
                    <button
                        className="console-btn console-btn-primary"
                        onClick={() => {
                            setSelectedLink(null);
                            setLinkMode('new');
                        }}
                    >
                        Add New
                    </button>
                </div>

                <div className="console-topbar-right">
                    <span className="console-node-indicator">selectedNode: {selectedNode && selectedNode._id}</span>
                    <button className="console-btn" onClick={logoutAction}>Logout</button>
                </div>
            </header>

            <DndProvider backend={HTML5Backend}>
                <div className="console-workspace">
                    <aside className="console-sidebar">
                        <Tree
                            structure={filteredData}
                            filter={filter}
                            setSelectedNode={setSelectedNode}
                            selectedNode={selectedNode}
                            refreshTreeLink={refreshTreeLink}
                            includeArchived={includeArchived}
                            setIncludeArchived={setIncludeArchived}
                        ></Tree>
                    </aside>
                    <main className="console-main">
                        <Links
                            selectedNode={selectedNode}
                            filteredTreeLinks={filteredData}
                            existingAuthors={existingAuthors}
                            refreshTreeLink={refreshTreeLink}
                            mode={linkMode}
                            setMode={setLinkMode}
                            selectedLink={selectedLink}
                            setSelectedLink={setSelectedLink}
                        />
                    </main>
                </div>
            </DndProvider>

            <footer className="console-statusbar">
                <Token date={date} />
                <div className='debug'>{params.login} is in the url. {auth?.currentUser?.email} is logged</div>
            </footer>
        </div>
    )
}


export default Console;