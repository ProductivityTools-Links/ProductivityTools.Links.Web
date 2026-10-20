import { useDrag } from 'react-dnd';
import LinkItemDeleteDialog from '../LinkItemDeleteDialog';
import React, { useState } from 'react';
import { parseAuthors } from './authorsUtils.js';
import LinkTypeIcon, { normalizeLinkType } from './LinkTypeIcon.js';
import service from '../../services/api.js';

function LinkItem({ link, editLink, refreshTreeLink, onLinkClicked }) {

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

    const recordLinkClick = () => {
        if (link && link._id != null) {
            link.clicks = (Number(link.clicks) || 0) + 1;
            service.incrementLinkClicks(link._id);
            if (onLinkClicked) {
                onLinkClicked(link);
            }
        }
    };

    const handleAuxClick = (e) => {
        if (e.button === 1) {
            recordLinkClick();
        }
    };

    const authorsList = parseAuthors(link.authors);
    const hasDescription = link.description && link.description.trim() !== '';
    const linkType = normalizeLinkType(link.type, link.url);
    const clicksCount = Number(link.clicks) || 0;

    return (
        <div className="link-row" ref={drag}>
            <div className="link-row-main">
                <LinkTypeIcon type={linkType} size={18} />
                <a
                    className="link-title"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.url || ''}
                    onClick={recordLinkClick}
                    onAuxClick={handleAuxClick}
                >
                    {link.name}
                </a>
                <span className="link-clicks-badge" title={`Clicks: ${clicksCount}`}>
                    {clicksCount}
                </span>
                {authorsList.map((author) => (
                    <span key={author} className="link-author-badge">@{author}</span>
                ))}
                {hasDescription && (
                    <span className="link-description">— {link.description}</span>
                )}
                {isDragging && (
                    <span
                        title="Moving..."
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            marginLeft: '6px',
                            color: '#2563eb',
                            verticalAlign: 'middle',
                        }}
                    >
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                            <path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z" />
                        </svg>
                    </span>
                )}
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