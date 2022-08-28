import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import NewLink from './NewLink'

function Links() {

    const [mode, setMode] = useState('list')


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