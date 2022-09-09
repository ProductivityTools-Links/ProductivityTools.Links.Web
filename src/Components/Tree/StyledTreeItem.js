import TreeItem from '@mui/lab/TreeItem';
import { useDrag, useDrop } from 'react-dnd'
import Box from '@mui/material/Box';



function StyledTreeItem({ element, treeLabelClick, ...rest }) {

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'treeItem',
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }))

    return (
        <TreeItem ref={drag} {...rest} nodeId={element.id.toString()} contextmenuId={element.id}
            label={<Box><button onClick={(e) => treeLabelClick(e, element.id)}>{element.name}</button><span>{isDragging && '😱'}</span></Box>} >
        </TreeItem >
    )
}

export default StyledTreeItem