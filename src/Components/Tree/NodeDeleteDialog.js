import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import service from '../../services/api.js'


function NodeDeleteDialog({ selectedNode, open, closeModal, closeAndRefresh }) {

    const handleCloseAndProceed = async () => {
        console.log(selectedNode);
        console.log("NodeDeleteDialog, handleCloseAndProceed", selectedNode._id);
        var r = await service.deleteNode(selectedNode._id);
        closeAndRefresh()
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={closeModal}

                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Remove?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Do you want to delete node <b>{selectedNode?.name}</b>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAndProceed} color="primary">
                        Yes
                    </Button>
                    <Button onClick={closeModal} color="primary" autoFocus>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default NodeDeleteDialog