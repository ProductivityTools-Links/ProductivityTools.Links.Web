import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import EditLink from './EditLink.js'
import LinkItem from './LinkItem';
import { parseAuthors } from './authorsUtils.js';
import './index.css';

const PAGE_SIZE = 100;

function Links({ selectedNode, filteredTreeLinks, existingAuthors, refreshTreeLink, mode = 'list', setMode, selectedLink, setSelectedLink }) {
    const targetNode = selectedNode || filteredTreeLinks;
    const [clickVersion, setClickVersion] = useState(0);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [authorsCollapsed, setAuthorsCollapsed] = useState(false);

    const handleLinkClicked = useCallback(() => {
        setClickVersion((v) => v + 1);
    }, []);

    const resolvedExistingAuthors = useMemo(() => {
        if (Array.isArray(existingAuthors) && existingAuthors.length > 0) {
            return existingAuthors;
        }
        if (filteredTreeLinks && Array.isArray(filteredTreeLinks.child)) {
            const authorsNode = filteredTreeLinks.child.find(
                (item) => item && (item._id === 'authors' || item.name === 'Authors')
            );
            if (authorsNode && Array.isArray(authorsNode.child)) {
                return authorsNode.child.map((a) => a && a.name).filter(Boolean);
            }
        }
        return [];
    }, [existingAuthors, filteredTreeLinks]);

    const nodeLinks = useMemo(() => {
        if (!targetNode) return [];

        let newLinksList = [];
        const seenIds = new Set();

        const flatLinkList = (currNode) => {
            if (!currNode || !currNode.child) return;

            const children = currNode.child;
            for (let i = 0; i < children.length; i++) {
                const item = children[i];
                if (!item) continue;
                if (item._type === "Link") {
                    if (!seenIds.has(item._id)) {
                        seenIds.add(item._id);
                        newLinksList.push(item);
                    }
                } else if (item._type === "Node") {
                    if (currNode === targetNode && (item._id === "authors" || item.name === "Authors")) {
                        continue;
                    }
                    flatLinkList(item);
                }
            }
        };

        flatLinkList(targetNode);
        newLinksList.sort((a, b) => (Number(b.clicks) || 0) - (Number(a.clicks) || 0));
        return newLinksList;
    }, [targetNode, clickVersion]);

    const displayedAuthors = useMemo(() => {
        const authorsMap = new Map();
        for (let i = 0; i < nodeLinks.length; i++) {
            const parsed = parseAuthors(nodeLinks[i].authors);
            for (let j = 0; j < parsed.length; j++) {
                const name = parsed[j];
                const key = name.toLowerCase();
                if (!authorsMap.has(key)) {
                    authorsMap.set(key, name);
                }
            }
        }
        return Array.from(authorsMap.values()).sort((a, b) => a.localeCompare(b));
    }, [nodeLinks]);

    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const prevTargetRef = useRef(targetNode);
    const loadMoreRef = useRef(null);

    let effectiveVisibleCount = visibleCount;
    let activeAuthor = selectedAuthor;
    if (prevTargetRef.current !== targetNode) {
        prevTargetRef.current = targetNode;
        effectiveVisibleCount = PAGE_SIZE;
        activeAuthor = null;
    }

    useEffect(() => {
        setVisibleCount(PAGE_SIZE);
        setSelectedAuthor(null);
    }, [targetNode]);

    const links = useMemo(() => {
        if (!activeAuthor) return nodeLinks;
        const lowerAuthor = activeAuthor.toLowerCase();
        return nodeLinks.filter((link) =>
            parseAuthors(link.authors).some((a) => a.toLowerCase() === lowerAuthor)
        );
    }, [nodeLinks, activeAuthor]);

    const handleAuthorToggle = useCallback((author) => {
        setVisibleCount(PAGE_SIZE);
        setSelectedAuthor((prev) =>
            prev && author && prev.toLowerCase() === author.toLowerCase() ? null : author
        );
    }, []);

    useEffect(() => {
        const sentinel = loadMoreRef.current;
        if (!sentinel || effectiveVisibleCount >= links.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, links.length));
                }
            },
            { rootMargin: '400px' }
        );
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [effectiveVisibleCount, links.length, mode]);

    const visibleLinks = useMemo(
        () => (links.length > effectiveVisibleCount ? links.slice(0, effectiveVisibleCount) : links),
        [links, effectiveVisibleCount]
    );

    const editLink = useCallback((link) => {
        setSelectedLink(link);
        setMode('new');
    }, [setMode, setSelectedLink]);

    if (mode == 'list')
        return (
            <div>
                <div className="links-header">
                    <div className="links-header-top">
                        <span className="links-selected-label">
                            Currently selected node: {selectedNode && (selectedNode.name || selectedNode.login)}
                        </span>
                        {displayedAuthors.length > 0 && (
                            <button
                                type="button"
                                className="links-authors-toggle"
                                onClick={() => setAuthorsCollapsed((prev) => !prev)}
                                title={authorsCollapsed ? 'Expand authors list' : 'Collapse authors list'}
                            >
                                <span>
                                    Authors ({displayedAuthors.length}){activeAuthor ? `: @${activeAuthor}` : ''}
                                </span>
                                <svg
                                    viewBox="0 0 24 24"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    style={{
                                        transform: authorsCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.15s ease',
                                    }}
                                >
                                    <path d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
                                </svg>
                            </button>
                        )}
                    </div>
                    {displayedAuthors.length > 0 && !authorsCollapsed && (
                        <div className="links-authors-filter">
                            <button
                                type="button"
                                className={`links-author-chip ${!activeAuthor ? 'active' : ''}`}
                                onClick={() => handleAuthorToggle(null)}
                            >
                                All
                            </button>
                            {displayedAuthors.map((author) => {
                                const isSelected = Boolean(
                                    activeAuthor && activeAuthor.toLowerCase() === author.toLowerCase()
                                );
                                return (
                                    <button
                                        type="button"
                                        key={author}
                                        className={`links-author-chip ${isSelected ? 'active' : ''}`}
                                        onClick={() => handleAuthorToggle(author)}
                                    >
                                        @{author}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
                <div className="links-list-card">
                    {visibleLinks.map(x => (
                        <LinkItem
                            key={x._id}
                            link={x}
                            editLink={editLink}
                            refreshTreeLink={refreshTreeLink}
                            onLinkClicked={handleLinkClicked}
                            onAuthorClick={handleAuthorToggle}
                            selectedAuthor={activeAuthor}
                        />
                    ))}
                    {effectiveVisibleCount < links.length && (
                        <div ref={loadMoreRef} style={{ height: '1px' }} />
                    )}
                </div>
            </div>
        )
    else {
        return (
            <EditLink
                setMode={setMode}
                selectedNode={selectedNode}
                existingAuthors={resolvedExistingAuthors}
                link={selectedLink}
                refreshTreeLink={refreshTreeLink}
            />
        )
    }
}

export default React.memo(Links);