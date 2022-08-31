import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import NewLink from './NewLink'
import service from '../../services/api';
import LinkItem from './LinkItem';

function Links() {

    const [mode, setMode] = useState('list')
    const [links, setLinks] = useState([])

    useEffect(() => {
        const call = async () => {
            let r = await service.getLinks();
            console.log("setLinks")
            setLinks(r);
            console.log(links);
        }
        call();
    }, [])

    if (mode == 'list')
        return (

            <div>
                {links && links.map(x => <LinkItem item={x} />)}
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