import TreeItem from '@mui/lab/TreeItem';
import { useDrag, useDrop } from 'react-dnd'
import Box from '@mui/material/Box';



function StyledTreeItem({ element, treeLabelClick, ...rest }) {

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'treeItem',
        item: element,
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }))

    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: 'treeItem',
            drop: (e) => console.log(e, element),
            collect: (monitor) => ({
                isOver: !!monitor.isOver()
            })
        }),
    )

    return (
        <TreeItem ref={drag} {...rest} nodeId={element.id.toString()} contextmenuId={element.id}
            label={<Box ref={drop}>
                <button onClick={(e) => treeLabelClick(e, element.id)}>{element.name}</button>
                <span>{isDragging && '😱'}</span>
                <span> {isOver && <span>Drop Here!</span>}</span>
            </Box>} >
        </TreeItem >
    )
}

export default StyledTreeItem