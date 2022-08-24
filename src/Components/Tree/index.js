import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import './index.css'
import ContextMenu from './ContextMenu';
import { useRef, useState } from 'react'
import AddNodeModal from './AddNodeModal';



function Tree({ structure }) {
    console.log('props')
    console.log(structure);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedNode, setSelectedNode] = useState("1");

    const containerRef = useRef(null);


    const handleModalClose = () => {
        setModalOpen(false);
    }
    const handleModalOpen = () => { setModalOpen(true); }


    function GetNode(n) {
        console.log("get node")
        console.log(n)
        return (
            n && n.nodes && n.nodes.map(x => {
                return (
                    <TreeItem nodeId={x.id.toString()} contextmenuId={x.id} label={x.name} >
                        {GetNode(x)}
                    </TreeItem>
                )
            })

        )
    }

    const menuItems = [
        {
            text: 'Add new tree item',
            onclick: (id) => { setSelectedNode(id); handleModalOpen(); }
        },
        {
            text: 'Delete',
            onclick: () => { console.log("hey") }
        }
    ];



    return (
        <div ref={containerRef}>
            <p>Tree1</p>
            <TreeView
                aria-label="file system navigator"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
            // sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
            >
                {GetNode(structure)}
            </TreeView>
            <ContextMenu parentRef={containerRef} items={menuItems}></ContextMenu>
            <AddNodeModal open={modalOpen} selectedTreeNode={selectedNode} handleModalClose={handleModalClose} />

            <p>endtree</p>

        </div>
    )
}

export default Tree