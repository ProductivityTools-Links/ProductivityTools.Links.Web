import TreeItem from '@mui/lab/TreeItem';
import { useDrag, useDrop } from 'react-dnd'
import Box from '@mui/material/Box';
import service from '../../services/api.js'



function StyledTreeItem({ element, treeLabelClick, ...rest }) {

    const moveItem = async (id, targetParentId) => {

        console.log("moveItem", id, targetParentId);
        await service.moveLink(id, targetParentId);
    }


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
            drop: (e, x) => moveItem(e.id, element.id),
            collect: (monitor) => ({
                isOver: !!monitor.isOver()
            })
        }),
    )

    return (
        <TreeItem ref={drag} {...rest} nodeId={element.id.toString()} contextmenuid={element.id}
            label={<Box ref={drop}>
                <button onClick={(e) => treeLabelClick(e, element.id)}>{element.name}</button>
                <span>{isDragging && '😱'}</span>
                <span> {isOver && <span>Drop Here!</span>}</span>
            </Box>} >
        </TreeItem >
    )
}

export default StyledTreeItem