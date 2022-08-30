import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import NewLink from './NewLink'
import service from '../../services/api';

function Links() {

    const [mode, setMode] = useState('list')
    const [links,setLinks]=useState([])

    useEffect(()=>{
        const call=async()=>{
            let r=await service.getLinks();
            console.log(r);
            setLinks(r);
        }
        call();
    },[])

    if (mode == 'list')
        return (

            <div>
                <Button variant="contained" onClick={() => setMode('new')}>Add New</Button>
                <span>List of Links</span>
            </div>
        )
    else {
        return (
            <NewLink setMode={setMode} />
        )
    }
}

export default Links;