import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import service from '../../services/api.js'


function LinkItemDeleteDialog({ selectedLinkItem, open, closeModal }) {

    const handleCloseAndProceed = async () => {
        console.log("LinkItemDeleteDialog, handleCloseAndProceed", selectedLinkItem);
         var r = await service.deleteLink(selectedLinkItem._id);
        
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
                        Do you want to Link item?
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

export default LinkItemDeleteDialog