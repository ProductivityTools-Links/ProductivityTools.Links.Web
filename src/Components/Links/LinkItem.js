import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import { useDrag } from 'react-dnd'


function LinkItem({ link }) {

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'treeItem',
        item: link,
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }))

    return (
        <Paper ref={drag}>
            <span><Tooltip title={link.url}><a href={link.url}>{link.name}</a></Tooltip> </span><br />
            <span>description: {link.description} </span>
            <span>{isDragging && '😱'}</span>

        </Paper>
    )
}

export default LinkItem;