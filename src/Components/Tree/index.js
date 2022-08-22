import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import './index.css'



function Tree({ structure }) {
    console.log('props')
    console.log(structure);

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


    return (
        <div>
            <p>Tree1</p>
            <TreeView
                aria-label="file system navigator"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
            >
                {GetNode(structure)}
            </TreeView>
            <p>endtree</p>
   
        </div>
    )
}

export default Tree