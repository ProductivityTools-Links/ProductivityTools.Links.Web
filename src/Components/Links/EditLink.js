import { useState, useEffect } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import service from '../../services/api.js';
import { parseAuthors } from './authorsUtils.js';
import LinkTypeIcon, { LINK_TYPES, normalizeLinkType, inferLinkTypeFromUrl } from './LinkTypeIcon.js';

function EditLink({ setMode, selectedNode, existingAuthors = [], refreshTreeLink, link }) {
    const [editLink, seteditLink] = useState({
        name: '',
        url: '',
        description: '',
        type: normalizeLinkType(link?.type, link?.url),
    });
    const [authors, setAuthors] = useState(() => parseAuthors(link?.authors));
    const [authorInput, setAuthorInput] = useState('');

    useEffect(() => {
        console.log("UseEffect", link);
        if (link != undefined) {
            seteditLink({
                ...link,
                type: normalizeLinkType(link.type, link.url),
            });
            setAuthors(parseAuthors(link.authors));
            setAuthorInput('');
        } else {
            seteditLink({ name: '', url: '', description: '', type: 'Undefined' });
            setAuthors([]);
            setAuthorInput('');
        }
    }, [link]);

    const updateLink = (e) => {
        const { name, value } = e.target;
        seteditLink(prevState => {
            const nextState = { ...prevState, [name]: value };
            if (name === 'url') {
                const inferred = inferLinkTypeFromUrl(value);
                if (inferred) {
                    nextState.type = inferred;
                }
            }
            return nextState;
        });
    };

    const handleAuthorsChange = (event, newValue) => {
        setAuthors(parseAuthors(newValue));
    };

    const handleAuthorInputChange = (event, newInputValue, reason) => {
        if (reason === 'reset') {
            setAuthorInput('');
            return;
        }
        if (/[,;\n]/.test(newInputValue)) {
            setAuthors((prev) => parseAuthors([...prev, newInputValue]));
            setAuthorInput('');
        } else {
            setAuthorInput(newInputValue);
        }
    };

    const handleAuthorBlur = () => {
        if (authorInput && authorInput.trim() !== '') {
            setAuthors((prev) => parseAuthors([...prev, authorInput]));
            setAuthorInput('');
        }
    };

    const createNew = async () => {
        const finalAuthors = parseAuthors([...authors, authorInput]);
        setAuthors(finalAuthors);
        setAuthorInput('');
        let linkId = await service.updateLink(
            editLink._id,
            selectedNode._id,
            editLink.name,
            editLink.url,
            editLink.description,
            finalAuthors,
            editLink.type || 'Undefined'
        );
        if (linkId != undefined) {
            setMode('list');
            refreshTreeLink();
        }
    };

    return (
        <div>

            <TextField id="linkName" name="name" label="Name" fullWidth variant="standard" value={editLink.name} onChange={updateLink} /><br />
            <TextField id="linkUrl" name="url" label="Url" fullWidth variant="standard" onChange={updateLink} value={editLink.url} /><br />
            <TextField
                id="linkType"
                name="type"
                label="Type"
                select
                fullWidth
                variant="standard"
                value={normalizeLinkType(editLink.type, editLink.url)}
                onChange={updateLink}
            >
                {LINK_TYPES.map((typeOption) => (
                    <MenuItem key={typeOption} value={typeOption}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <LinkTypeIcon type={typeOption} size={18} />
                            <span>{typeOption}</span>
                        </span>
                    </MenuItem>
                ))}
            </TextField><br />
            <TextField id="linkDescription" name="description" fullWidth label="Description" variant="standard" multiline value={editLink.description || ''} onChange={updateLink} /><br />
            <Autocomplete
                multiple
                freeSolo
                id="linkAuthors"
                options={existingAuthors}
                value={authors}
                inputValue={authorInput}
                onChange={handleAuthorsChange}
                onInputChange={handleAuthorInputChange}
                onBlur={handleAuthorBlur}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                        const { key, ...tagProps } = getTagProps({ index });
                        return (
                            <Chip
                                key={key}
                                variant="outlined"
                                size="small"
                                label={option}
                                {...tagProps}
                            />
                        );
                    })
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        name="authors"
                        label="Authors"
                        variant="standard"
                        fullWidth
                        placeholder={authors.length === 0 ? "Add author and press Enter or comma..." : ""}
                    />
                )}
            /><br />
            <Button variant="contained" onClick={createNew}>{link ? "Update" : "Add"}</Button>

            <Button variant="contained" onClick={() => setMode('list')}>Cancel</Button>
            <br />
            <br />


            <div className='debug'>
            <span>{editLink._id} </span>
                <span>{editLink.name}</span> <span>{editLink.url}</span> <span>{editLink.description}</span>
                <span>Parent name: {selectedNode.name} ParentId {selectedNode._id}</span>
            </div>
        </div>
    );
}

export default EditLink;
