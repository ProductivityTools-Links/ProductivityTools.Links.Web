import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import { useDrag } from 'react-dnd'
import EditIcon from '@mui/icons-material/Edit';
import { IconButton  } from '@mui/material';


function LinkItem({ link }) {

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'treeItem',
        item: link,
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }))

    return (
        <span className="linkItem" ref={drag}>

            <span><Tooltip title={link.url}><a href={link.url}>{link.name}</a></Tooltip> </span>
            <span>- {link.description} </span>
            <span>{isDragging && '😱'}</span>
            <button className='editLink'></button>        
        </span>
    )
}

export default LinkItem;