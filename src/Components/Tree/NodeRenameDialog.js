import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import service from '../../services/api.js';

function NodeRenameDialog({ selectedNode, open, closeModal, closeAndRefresh, refreshTreeLink }) {
    const [nodeName, setNodeName] = useState('');

    useEffect(() => {
        if (selectedNode) {
            setNodeName(selectedNode.name || selectedNode.login || '');
        }
    }, [selectedNode, open]);

    const handleCloseAndProceed = async () => {
        if (!selectedNode || !nodeName.trim()) {
            return;
        }
        await service.updateNode(selectedNode._id, nodeName);
        if (closeAndRefresh) {
            closeAndRefresh();
        } else {
            if (refreshTreeLink) refreshTreeLink();
            if (closeModal) closeModal();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleCloseAndProceed();
        }
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={closeModal}
                aria-labelledby="rename-dialog-title"
            >
                <DialogTitle id="rename-dialog-title">Rename tree item</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="renameNodeName"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={nodeName}
                        onChange={(e) => setNodeName(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAndProceed} color="primary">
                        Rename
                    </Button>
                    <Button onClick={closeModal} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default NodeRenameDialog;
