import TreeView from '@material-ui/lab/TreeView'
import TreeItem from '@material-ui/lab/TreeItem';

function Tree({structure}) {
    console.log('props')
    console.log(structure);

    function GetNode(n) {
        return (
            n && n.nodes && n.nodes.map(x => {
                return (
                    <TreeItem label={x.name} >
                     {GetNode(x)}
                    </TreeItem>
                )
            })

        )
    }

    return (
        <div>
            <p>Tree1</p>
            <TreeView>
                {GetNode(structure)}
            </TreeView>
            <p>endtree</p>
        </div>
    )
}

export default Tree