import { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import service from '../../services/api.js'


function EditLink({ setMode, selectedNode, refreshTreeLink, link }) {

    const [editLink, seteditLink] = useState({ name: '', url: '', description: '' })

    useEffect(() => {
        console.log("UseEffect", link);
        if (link != undefined) {
            seteditLink(link)
        }
    }, [link]);

    const updateLink = (e) => {
        const { name, value } = e.target;
        seteditLink(prevState => ({
            ...prevState, [name]: value
        }))
    }

    const createNew = async () => {
        let linkId = await service.updateLink(editLink.id, selectedNode._id, editLink.name, editLink.url, editLink.description)
        if (linkId != undefined) {
            setMode('list')
            refreshTreeLink();
        }
    }

    return (
        <div>

            <TextField id="linkName" name="name" label="Name" fullWidth variant="standard" value={editLink.name} onChange={updateLink} /><br />
            <TextField id="linkUrl" name="url" label="Url" fullWidth variant="standard" onChange={updateLink} value={editLink.url} /><br />
            <TextField id="linkDescription" name="description" fullWidth label="Description" variant="standard" multiline value={editLink.description || ''} onChange={updateLink} /><br />
            <Button variant="contained" onClick={createNew}>{link ? "Update" : "Add"}</Button>

            <Button variant="contained" onClick={() => setMode('list')}>Cancel</Button>
            <br />
            <br />


            <div className='debug'>
                <span>{editLink.name}</span> <span>{editLink.url}</span> <span>{editLink.description}</span>
                <span>Parent name: {selectedNode.name} ParentId {selectedNode.id}</span>
            </div>
        </div>
    )
}

export default EditLink