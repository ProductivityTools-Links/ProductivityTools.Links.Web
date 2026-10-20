import React from 'react';

export const LINK_TYPES = ['Undefined', 'Document', 'Slides', 'Sheets', 'Drawing', 'Page'];

export function inferLinkTypeFromUrl(url) {
    if (!url || typeof url !== 'string') {
        return null;
    }
    const lower = url.toLowerCase();
    if (lower.includes('docs.google.com/document')) {
        return 'Document';
    }
    if (lower.includes('docs.google.com/presentation')) {
        return 'Slides';
    }
    if (lower.includes('docs.google.com/spreadsheets')) {
        return 'Sheets';
    }
    if (lower.includes('docs.google.com/drawings')) {
        return 'Drawing';
    }
    return null;
}

export function normalizeLinkType(type, url) {
    if (type !== null && type !== undefined) {
        const cleaned = String(type).trim().toLowerCase();
        if (cleaned === 'document') {
            return 'Document';
        }
        if (cleaned === 'slides') {
            return 'Slides';
        }
        if (cleaned === 'sheets') {
            return 'Sheets';
        }
        if (cleaned === 'drawing') {
            return 'Drawing';
        }
        if (cleaned === 'page') {
            return 'Page';
        }
    }

    const inferred = inferLinkTypeFromUrl(url);
    if (inferred) {
        return inferred;
    }

    return 'Undefined';
}

function DocumentIcon({ size }) {
    return (
        <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
            <path
                d="M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
                fill="#4285F4"
            />
            <path
                d="M14 2l6 6h-4.5A1.5 1.5 0 0 1 14 6.5V2z"
                fill="#1967D2"
            />
            <rect x="7.5" y="11" width="9" height="1.6" rx="0.6" fill="#FFFFFF" />
            <rect x="7.5" y="14" width="9" height="1.6" rx="0.6" fill="#FFFFFF" />
            <rect x="7.5" y="17" width="6" height="1.6" rx="0.6" fill="#FFFFFF" />
        </svg>
    );
}

function SlidesIcon({ size }) {
    return (
        <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
            <path
                d="M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
                fill="#FBBC04"
            />
            <path
                d="M14 2l6 6h-4.5A1.5 1.5 0 0 1 14 6.5V2z"
                fill="#F29900"
            />
            <rect
                x="7.2"
                y="11"
                width="9.6"
                height="6.8"
                rx="1"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.7"
            />
        </svg>
    );
}

function SheetsIcon({ size }) {
    return (
        <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
            <path
                d="M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
                fill="#34A853"
            />
            <path
                d="M14 2l6 6h-4.5A1.5 1.5 0 0 1 14 6.5V2z"
                fill="#188038"
            />
            <rect
                x="7.2"
                y="10.8"
                width="9.6"
                height="7.4"
                rx="0.8"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.5"
            />
            <line x1="7.2" y1="14.5" x2="16.8" y2="14.5" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="12" y1="10.8" x2="12" y2="18.2" stroke="#FFFFFF" strokeWidth="1.5" />
        </svg>
    );
}

function DrawingIcon({ size }) {
    return (
        <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
            <path
                d="M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
                fill="#EA4335"
            />
            <path
                d="M14 2l6 6h-4.5A1.5 1.5 0 0 1 14 6.5V2z"
                fill="#C5221F"
            />
            <circle cx="10.2" cy="13.2" r="2.7" fill="#FFFFFF" />
            <rect x="11.2" y="13.4" width="5.2" height="5.2" rx="0.7" fill="#FAD2CF" stroke="#EA4335" strokeWidth="0.6" />
        </svg>
    );
}

function PageIcon({ size }) {
    return (
        <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.6" />
            <ellipse cx="12" cy="12" rx="4.2" ry="9" fill="none" stroke="#0284C7" strokeWidth="1.4" />
            <line x1="3.4" y1="9" x2="20.6" y2="9" stroke="#0284C7" strokeWidth="1.3" />
            <line x1="3.4" y1="15" x2="20.6" y2="15" stroke="#0284C7" strokeWidth="1.3" />
        </svg>
    );
}

function UndefinedIcon({ size }) {
    return (
        <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
            <circle
                cx="12"
                cy="12"
                r="9"
                fill="#F1F5F9"
                stroke="#94A3B8"
                strokeWidth="1.6"
                strokeDasharray="3 2"
            />
            <path
                d="M9.8 9.6a2.3 2.3 0 0 1 4.4.8c0 1.5-2.2 1.8-2.2 3.2"
                fill="none"
                stroke="#64748B"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
            <circle cx="12" cy="16.8" r="1.1" fill="#64748B" />
        </svg>
    );
}

export default function LinkTypeIcon({ type, url, size = 18 }) {
    const normalized = normalizeLinkType(type, url);

    let icon;
    switch (normalized) {
        case 'Document':
            icon = <DocumentIcon size={size} />;
            break;
        case 'Slides':
            icon = <SlidesIcon size={size} />;
            break;
        case 'Sheets':
            icon = <SheetsIcon size={size} />;
            break;
        case 'Drawing':
            icon = <DrawingIcon size={size} />;
            break;
        case 'Page':
            icon = <PageIcon size={size} />;
            break;
        case 'Undefined':
        default:
            icon = <UndefinedIcon size={size} />;
            break;
    }

    return (
        <span
            className={`link-type-icon link-type-icon-${normalized.toLowerCase()}`}
            title={normalized}
            aria-label={normalized}
        >
            {icon}
        </span>
    );
}
