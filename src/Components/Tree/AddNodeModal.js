import React, { useState } from 'react'
import Modal from '@mui/material/Modal';
import service from '../../services/api.js'

export default function AddNodeModal({handleModalClose,selectedNode,...props}) {

    console.log(props);
    console.log("iner props")
    const [treeName, setTreeeName] = useState('new');

    const addNewItem = function () {
        debugger;
        service.addNode(selectedNode.id, treeName)
        // apiService.addTreeNode(Number(props.selectedTreeNode), treeName);
        handleModalClose();
    }

    const cancel = () => {
        handleModalClose()
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
            <button onClick={cancel}>Here selected node should be - selectedNode</button>
        </div>
    )
    return <Modal
        {...props} //modal open and close
    ><div>{body}</div></Modal>
}