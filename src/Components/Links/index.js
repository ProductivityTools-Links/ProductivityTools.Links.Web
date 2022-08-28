import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function Links() {

    const [mode, setMode] = useState('list')

    const createNew = () => {
        setMode('new')
    }

    if (mode == 'list')
        return (

            <div>
                <Button variant="contained" onClick={createNew}>Add New</Button>
                <span>List of Links</span>
            </div>
        )
    else {
        return (
            <div>
                <TextField id="linkName" label="Name" variant="outlined" /><br/>
                <TextField id="linkUrl" label="Url" variant="outlined" /><br/>
                <TextField id="linkDescription" label="Description" variant="outlined" /><br/>
                <Button variant="contained" onClick={() => setMode('list')}>Add</Button>

                <Button variant="contained" onClick={() => setMode('list')}>Cancel</Button>
            </div>
        )
    }
}

export default Links;