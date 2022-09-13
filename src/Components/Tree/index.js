import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import './index.css'
import ContextMenu from './ContextMenu';
import { useRef, useState } from 'react'
import AddNodeModal from './AddNodeModal';
import StyledTreeItem from './StyledTreeItem.js'
import TreeItem from '@mui/lab/TreeItem';




function Tree({ structure, setSelectedNode, selectedNode }) {
    //console.log('props')
    //console.log(structure);
    const [modalOpen, setModalOpen] = useState(false);
    // const [selectedNode, setSelectedNode] = useState("1");

    const containerRef = useRef(null);

    const handleModalClose = () => {
        setModalOpen(false);
    }
    const handleModalOpen = () => { setModalOpen(true); }

    const treeLabelClick = (e, id) => {
        nodeSelectTree(id);
        e.stopPropagation();
    }



    function GetNode(n) {
        // console.log("get node")
        // console.log(n)
        return (
            n && n.nodes && n.nodes.map(x => {
                return (
                    <StyledTreeItem element={x} key={x.id} treeLabelClick={treeLabelClick}>
                        {GetNode(x)}
                    </StyledTreeItem>
                )
            })

        )
    }

    function GetNode2(n) {
        // console.log("get node")
        //console.log(n)
        return (
            n && n.nodes && n.nodes.map(x => {
                return (<p>
                    <p>{x.name}</p>
                    <p>{GetNode2(x)}</p>
                </p>
                )
            })

        )
    }

    const findNode = (nodes, id) => {
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].id == id) {
                return nodes[i];
            }
            else {
                let subresult = findNode(nodes[i].nodes, id)
                if (subresult != null) {
                    return subresult;
                }
            }
        }
    }

    // const nodeSelect = (e, id) => {
    //     nodeSelectTree(id)
    // }

    const nodeSelectTree = (id) => {
        let node = findNode(structure.nodes, id)
        setSelectedNode(node);
    }

    const menuItems = [
        {
            text: 'Add new tree item',
            onclick: (id) => { nodeSelectTree(id); handleModalOpen(); }
        },
        {
            text: 'Delete',
            onclick: () => { console.log("hey") }
        }
    ];



    return (
        <div ref={containerRef}>
            <p>Tree1</p>
            <p>{selectedNode && selectedNode.id}</p>
            <TreeView
                aria-label="file system navigator"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
            // onNodeSelect={nodeSelect}
            // sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
            >
                <TreeItem nodeId="2"  label={structure && structure.login}>
                    {GetNode(structure)}
                </TreeItem>
            </TreeView>

            <ContextMenu parentRef={containerRef} items={menuItems}></ContextMenu>
            <AddNodeModal open={modalOpen} selectedNode={selectedNode} handleModalClose={handleModalClose} />

            <p>endtree</p>
            {/* {GetNode2(structure)} */}
        </div>
    )
}

export default Tree