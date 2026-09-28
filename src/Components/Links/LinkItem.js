import { useDrag } from 'react-dnd';
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
    }), [link]);

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
                <a className="link-title" href={link.url} title={link.url || ''}>{link.name}</a>
                {hasAuthor && (
                    <span className="link-author-badge">@{link.authors.trim()}</span>
                )}
                {hasDescription && (
                    <span className="link-description">— {link.description}</span>
                )}
                {isDragging && <span>😱</span>}
            </div>

            <div className="link-row-actions">
                <button
                    type="button"
                    className="link-action-btn"
                    title={copied ? 'Copied!' : 'Copy URL'}
                    onClick={copyLinkUrl}
                >
                    {copied ? (
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="#16a34a" aria-hidden="true">
                            <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="#94a3b8" aria-hidden="true">
                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                        </svg>
                    )}
                </button>
                <button
                    type="button"
                    className="link-action-btn"
                    title="Edit"
                    onClick={editLinkItem}
                >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="#94a3b8" aria-hidden="true">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                </button>
                <button
                    type="button"
                    className="link-action-btn"
                    title="Delete"
                    onClick={deleteLinkItem}
                >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="#94a3b8" aria-hidden="true">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                    </svg>
                </button>
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