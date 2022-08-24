import React, { useState } from 'react'
import Modal from '@mui/material/Modal';

export default function AddNodeModal(props) {

    const [treeName, setTreeeName] = useState('new');

    const addNewItem = function () {
        //    apiService.addTreeNode(Number(props.selectedTreeNode), treeName);
        props.handleModalClose();
    }

    const cancel = () => {
        props.handleModalClose()
    }

    const handleChange = (e) => {
        setTreeeName(e.target.value);
    }

    const body = (
        <div>
            <p>New tree item name:</p>
            <input type='text' value={treeName} onChange={handleChange} />
            <button onClick={addNewItem}>Add</button>
            <button onClick={cancel}>Cancel</button>
        </div>
    )
    return <Modal
        {...props} //modal open and close
    ><p>{body}</p></Modal>
}