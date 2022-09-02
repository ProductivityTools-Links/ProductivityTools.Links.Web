import { useState } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import service from '../../services/api.js'



function NewLink({ setMode, selectedNode }) {

    const [newLink, setNewLink] = useState({ name: '', url: '', description: '' })

    const updateLink = (e) => {
        const { name, value } = e.target;
        setNewLink(prevState => ({
            ...prevState, [name]: value
        }))
    }

    const createNew = () => {
        service.addLink(selectedNode.id, newLink.name, newLink.url, newLink.description)
    }

    return (
        <div>
            <span>Parent: {selectedNode.name} {selectedNode.id}</span>
            <TextField id="linkName" name="name" label="Name" variant="outlined" value={newLink.name} onChange={updateLink} /><br />
            <TextField id="linkUrl" name="url" label="Url" variant="outlined" onChange={updateLink} /><br />
            <TextField id="linkDescription" name="description" label="Description" variant="outlined" onChange={updateLink} /><br />
            <Button variant="contained" onClick={createNew}>Add</Button>

            <Button variant="contained" onClick={() => setMode('list')}>Cancel</Button>
            <span>{newLink.name}</span> <span>{newLink.url}</span> <span>{newLink.description}</span>
        </div>
    )
}

export default NewLink