import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import { useDrag, } from 'react-dnd'
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkItemDeleteDialog from '../LinkItemDeleteDialog'
import React, { useState } from 'react';


function LinkItem({ link, editLink }) {

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'treeItem',
        item: link,
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }))

    const editLinkItem = () => {
        editLink(link);
    }

    const deleteLinkItem = () => {
        setDeleteModalOpen(true)
    }
    const closeModal = () => {
        setDeleteModalOpen(false)
    }

    return (
        <div>
            <span className="linkItem" ref={drag}>

                <span><Tooltip title={link.url}><a href={link.url}>{link.name}</a></Tooltip> </span>
                <span><i>*{link.authors}*</i></span>
                {link.description && <span>- {link.description}</span>}
                <span>{isDragging && '😱'}</span>
                {/* <button className='editLink' onClick={edit}></button><EditIcon><button onClick={edit}></button></EditIcon> */}
                <IconButton onClick={editLinkItem}><EditIcon style={{ color: '#D3D3D3' }}></EditIcon></IconButton>
                <IconButton onClick={deleteLinkItem}><DeleteIcon style={{ color: '#D3D3D3' }} ></DeleteIcon></IconButton>
            </span>
            <LinkItemDeleteDialog
                selectedLinkItem={link}
                open={deleteModalOpen}
                // selectedJournal={selectedTreeNode}
                closeModal={closeModal}
            // closeAndRefresh={closeAndRefresh}
            ></LinkItemDeleteDialog>
        </div>
    )
}

export default LinkItem;