import Tooltip from '@mui/material/Tooltip';
import { useDrag } from 'react-dnd';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkItemDeleteDialog from '../LinkItemDeleteDialog';
import React, { useState } from 'react';


function LinkItem({ link, editLink, refreshTreeLink }) {

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'treeItem',
        item: link,
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const editLinkItem = () => {
        editLink(link);
    };

    const copyLinkUrl = () => {
        if (link.url && navigator.clipboard) {
            navigator.clipboard.writeText(link.url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
    };

    const deleteLinkItem = () => {
        setDeleteModalOpen(true);
    };
    const closeModal = () => {
        setDeleteModalOpen(false);
    };

    const closeAndRefresh = () => {
        closeModal();
        refreshTreeLink();
    };

    const hasAuthor = link.authors && link.authors.trim() !== '';
    const hasDescription = link.description && link.description.trim() !== '';

    return (
        <div className="link-row" ref={drag}>
            <div className="link-row-main">
                <Tooltip title={link.url || ''}>
                    <a className="link-title" href={link.url}>{link.name}</a>
                </Tooltip>
                {hasAuthor && (
                    <span className="link-author-badge">@{link.authors.trim()}</span>
                )}
                {hasDescription && (
                    <span className="link-description">— {link.description}</span>
                )}
                {isDragging && <span>😱</span>}
            </div>

            <div className="link-row-actions">
                <Tooltip title={copied ? 'Copied!' : 'Copy URL'}>
                    <IconButton size="small" onClick={copyLinkUrl}>
                        {copied ? (
                            <CheckIcon fontSize="small" style={{ color: '#16a34a' }} />
                        ) : (
                            <ContentCopyIcon fontSize="small" style={{ color: '#94a3b8' }} />
                        )}
                    </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                    <IconButton size="small" onClick={editLinkItem}>
                        <EditIcon fontSize="small" style={{ color: '#94a3b8' }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton size="small" onClick={deleteLinkItem}>
                        <DeleteIcon fontSize="small" style={{ color: '#94a3b8' }} />
                    </IconButton>
                </Tooltip>
            </div>

            {deleteModalOpen && (
                <LinkItemDeleteDialog
                    selectedLinkItem={link}
                    open={deleteModalOpen}
                    closeModal={closeModal}
                    closeAndRefresh={closeAndRefresh}
                />
            )}
        </div>
    );
}

export default React.memo(LinkItem);