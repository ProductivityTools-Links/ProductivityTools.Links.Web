import React, { useState } from 'react'
import Modal from '@mui/material/Modal';
import service from '../../services/api.js'

export default function AddNodeModal(props) {

    console.log(props);
    const [treeName, setTreeeName] = useState('new');

    const addNewItem = function () {
        service.addNode(props.selectedNode, treeName)
        // apiService.addTreeNode(Number(props.selectedTreeNode), treeName);
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
            <button onClick={cancel}>{props.selectedNode}</button>
        </div>
    )
    return <Modal
        {...props} //modal open and close
    ><p>{body}</p></Modal>
}