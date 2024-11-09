import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function LinkItemDeleteDialog({ open, closeModal }) {

    const handleCloseAndProceed = async () => {
        console.log("handleCloseAndProceed");
        // console.log(selectedJournal);
        // var r = await apiService.deleteTree(selectedJournal.id);
        // if (r) {
        //   closeAndRefresh(false);
        // }
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={closeModal}

                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Remove Tree Node?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Do you want to remove
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