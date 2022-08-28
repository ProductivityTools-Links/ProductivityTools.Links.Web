import { useState } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function NewLink(props) {

    const [newLink, setNewLink] = useState({ name: '', url: '', description: '' })

    const updateLink = (e) => {
        const { name, value } = e.target;
        setNewLink(prevState => ({
            ...prevState, [name]: value
        }))
    }

    const createNew = () => {

    }

    return (
        <div>
            <TextField id="linkName" name="name" label="Name" variant="outlined" value={newLink.name} onChange={updateLink} /><br />
            <TextField id="linkUrl" name="url" label="Url" variant="outlined" onChange={updateLink} /><br />
            <TextField id="linkDescription" name="description" label="Description" variant="outlined" onChange={updateLink} /><br />
            <Button variant="contained" onClick={createNew}>Add</Button>

            <Button variant="contained" onClick={() => props.setMode('list')}>Cancel</Button>
            <span>{newLink.name}</span> <span>{newLink.url}</span> <span>{newLink.description}</span>
        </div>
    )
}

export default NewLink