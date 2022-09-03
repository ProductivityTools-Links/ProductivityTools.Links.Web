import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';


function LinkItem(props) {
    return (
        <Paper>
            <span><Tooltip title={props.item.url}><a href={props.item.url}>{props.item.name}</a></Tooltip> </span><br/>
            <span>description: {props.item.description} </span>
        </Paper>
    )
}

export default LinkItem;