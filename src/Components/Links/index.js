import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import NewLink from './NewLink'
import service from '../../services/api';
import LinkItem from './LinkItem';
import Stack from '@mui/material/Stack'

function Links({ selectedNode }) {

    const [mode, setMode] = useState('list')
    const [links, setLinks] = useState([])

    useEffect(() => {
        const call = async () => {
            if (selectedNode) {
                let r = await service.getLinks(selectedNode.id);
                console.log("setLinks")
                setLinks(r);
                console.log(links);
            }
        }
        call();
    }, [selectedNode])

    if (mode == 'list')
        return (

            <div>
                <span>Currently selected node: {selectedNode && selectedNode.name}</span>
                <Stack spacing={2}>
                    {links && links.map(x => <LinkItem key={x.id} link={x} />)}
                </Stack>
                <Button variant="contained" onClick={() => setMode('new')}>Add New</Button>
                <span>List of Links</span>
            </div>
        )
    else {
        return (
            <NewLink setMode={setMode} selectedNode={selectedNode} />
        )
    }
}

export default Links;