import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import './index.css'
import ContextMenu from './ContextMenu';
import { useRef, useState, useEffect } from 'react'
import AddNodeModal from './AddNodeModal';
import StyledTreeItem from './StyledTreeItem.js'
import TreeItem from '@mui/lab/TreeItem';
import NodeDeleteDialog from './NodeDeleteDialog.js';
import NodeRenameDialog from './NodeRenameDialog.js';




function Tree({ structure, filter, setSelectedNode, selectedNode, refreshTreeLink }) {
    //console.log('props')
    //console.log(structure);
    const [modalOpen, setModalOpen] = useState(false);
    const [nodeDeleteDialogOpen, setnNodeDeleteDialogOpen] = useState(false)
    const [nodeRenameDialogOpen, setNodeRenameDialogOpen] = useState(false)
    // const [selectedNode, setSelectedNode] = useState("1");
    const [expanded, setExpanded] = useState([]);
    const prevExpandedRef = useRef([]);
    const isFilteringRef = useRef(false);
    const initialExpandedDoneRef = useRef(false);

    const getAllNodeIds = (node) => {
        let ids = [];
        if (!node) return ids;
        if (node._id !== undefined && node._id !== null) {
            ids.push(node._id.toString());
        }
        if (node.child && Array.isArray(node.child)) {
            node.child.forEach((c) => {
                if (c._type === 'Node' || (c.child && c._type !== 'Link')) {
                    ids = ids.concat(getAllNodeIds(c));
                }
            });
        }
        return ids;
    };

    useEffect(() => {
        if (!structure) return;

        if (!initialExpandedDoneRef.current && structure._id) {
            initialExpandedDoneRef.current = true;
            setExpanded([structure._id.toString()]);
        }
    }, [structure]);

    useEffect(() => {
        if (!structure) return;

        if (filter && filter.trim() !== '') {
            if (!isFilteringRef.current) {
                prevExpandedRef.current = expanded;
                isFilteringRef.current = true;
            }
            const allIds = getAllNodeIds(structure);
            setExpanded(Array.from(new Set(allIds)));
        } else if (isFilteringRef.current) {
            isFilteringRef.current = false;
            const toRestore = prevExpandedRef.current.length > 0
                ? prevExpandedRef.current
                : (structure._id ? [structure._id.toString()] : []);
            setExpanded(toRestore);
        }
    }, [filter, structure]);

    const handleNodeToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    };

    const containerRef = useRef(null);

    const handleModalClose = () => {
        setModalOpen(false);
    }
    const handleModalOpen = () => { setModalOpen(true); }

    const treeLabelClick = (e, id) => {
        nodeSelectTree(id);
        e.stopPropagation();
    }

    const nodeDeleteDialogClose = () => { setnNodeDeleteDialogOpen(true) }
    const handleNodeRenameOpen = () => { setNodeRenameDialogOpen(true); }
    const handleNodeRenameClose = () => { setNodeRenameDialogOpen(false); }

    const closeAndRefresh = () => {
        setnNodeDeleteDialogOpen(false);
        setNodeRenameDialogOpen(false);
        refreshTreeLink();
    }

    function GetNode(n) {
        // console.log("get node")
        //console.log(n)

        return (
            n && n.child && (n.child).filter((x) => x._type == "Node").sort((a, b) => a.name < b.name ? -1 : 1).map(x => {

                if (x._type == 'Node') {
                    return (
                        <StyledTreeItem element={x} key={x._id} treeLabelClick={treeLabelClick} refreshTreeLink={refreshTreeLink}>
                            {GetNode(x)}
                        </StyledTreeItem>
                    )
                }
                else {
                    return undefined;
                }
            })
        )

    }

    // function GetNode2(n) {
    //     // console.log("get node")
    //     //console.log(n)
    //     return (
    //         n && n.nodes && n.nodes.map(x => {
    //             return (<div>
    //                 <p>{x.name}</p>
    //                 <p>{GetNode2(x)}</p>
    //             </div>
    //             )
    //         })

    //     )
    // }

    const findNode = (nodes, id) => {
        if (nodes) {
            for (let i = 0; i < nodes.length; i++) {
                if (nodes[i]._id == id) {
                    return nodes[i];
                }
                else {
                    let subresult = findNode(nodes[i].child, id)
                    if (subresult != null) {
                        return subresult;
                    }
                }
            }
        }
    }

    // const nodeSelect = (e, id) => {
    //     nodeSelectTree(id)
    // }

    const nodeSelectTree = (id) => {
        if (structure._id == id) {
            setSelectedNode(structure)
        }
        else {
            let node = findNode(structure.child, id)
            setSelectedNode(node);
        }
    }

    const menuItems = [
        {
            text: 'Add new tree item',
            //onclick: (id) => { nodeSelectTree(id); handleModalOpen(); }
            onclick: (id) => { handleModalOpen(); }
        },
        {
            text: 'Rename',
            onclick: () => { handleNodeRenameOpen(); }
        },
        {
            text: 'Delete',
            onclick: () => { nodeDeleteDialogClose() }
        }
    ];


    return (structure &&
        <div ref={containerRef}>

            <TreeView
                aria-label="file system navigator"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                expanded={expanded}
                onNodeToggle={handleNodeToggle}
            // onNodeSelect={nodeSelect}
            // sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
            >
                <TreeItem nodeId={structure._id.toString()} label=<button className='treebutton' onClick={(e) => treeLabelClick(e, structure._id)}>{structure.login}</button> contextmenuid={structure._id}>
                    {GetNode(structure)}
                </TreeItem>
            </TreeView>

            <ContextMenu parentRef={containerRef} items={menuItems}></ContextMenu>
            <AddNodeModal open={modalOpen} selectedNode={selectedNode} handleModalClose={handleModalClose} refreshTreeLink={refreshTreeLink} />
            <NodeRenameDialog open={nodeRenameDialogOpen} selectedNode={selectedNode} closeModal={handleNodeRenameClose} closeAndRefresh={closeAndRefresh} refreshTreeLink={refreshTreeLink} />
            <NodeDeleteDialog open={nodeDeleteDialogOpen} selectedNode={selectedNode} closeModal={() => setnNodeDeleteDialogOpen(false)} closeAndRefresh={closeAndRefresh} refreshTreeLink={refreshTreeLink} ></NodeDeleteDialog>
            {/* <p className='debug'>{selectedNode && selectedNode.id}</p> */}
            {/* {GetNode2(structure)} */}
        </div>
    )

}

export default Tree