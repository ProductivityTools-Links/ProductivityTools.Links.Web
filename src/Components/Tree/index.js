import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import './index.css'
import ContextMenu from './ContextMenu';
import { useRef } from 'react'



function Tree({ structure }) {
    console.log('props')
    console.log(structure);
    const containerRef = useRef(null);

    function GetNode(n) {
        console.log("get node")
        console.log(n)
        return (
            n && n.nodes && n.nodes.map(x => {
                return (
                    <TreeItem nodeId={x.id.toString()} label={x.name} >
                        {GetNode(x)}
                    </TreeItem>
                )
            })

        )
    }

    const menuItems = [
        {
            text: 'Add new tree item',
            onclick: (e,k) => { console.log(e); console.log(k); }
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
            {/* <ContextMenu parentRef={containerRef} items={menuItems}></ContextMenu> */}
            <p>endtree</p>

        </div>
    )
}

export default Tree