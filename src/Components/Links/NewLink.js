import { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import service from '../../services/api.js'


function NewLink({ setMode, selectedNode, refreshTreeLink, link }) {

    const [newLink, setNewLink] = useState({ name: '', url: '', description: '' })

    useEffect(() => {
        console.log("UseEffect", link);
        if (link != undefined) {
            setNewLink(link)
        }
    }, [link]);

    const updateLink = (e) => {
        const { name, value } = e.target;
        setNewLink(prevState => ({
            ...prevState, [name]: value
        }))
    }

    const createNew = async () => {
        let linkId = await service.addLink(selectedNode.id, newLink.name, newLink.url, newLink.description)
        if (linkId != undefined) {
            setMode('list')
            refreshTreeLink();
        }
    }

    return (
        <div>

            <TextField id="linkName" name="name" label="Name" fullWidth variant="standard" value={newLink.name} onChange={updateLink} /><br />
            <TextField id="linkUrl" name="url" label="Url" fullWidth variant="standard" onChange={updateLink} value={newLink.url} /><br />
            <TextField id="linkDescription" name="description" fullWidth label="Description" variant="standard" multiline value={newLink.description || ''} onChange={updateLink} /><br />
            <Button variant="contained" onClick={createNew}>Add</Button>

            <Button variant="contained" onClick={() => setMode('list')}>Cancel</Button>
            <br />
            <br />


            <div className='debug'>
                <span>{newLink.name}</span> <span>{newLink.url}</span> <span>{newLink.description}</span>
                <span>Parent name: {selectedNode.name} ParentId {selectedNode.id}</span>
            </div>
        </div>
    )
}

export default NewLink