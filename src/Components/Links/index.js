import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import EditLink from './EditLink.js'
import LinkItem from './LinkItem';
import './index.css';

const PAGE_SIZE = 100;

function Links({ selectedNode, filteredTreeLinks, refreshTreeLink, mode = 'list', setMode, selectedLink, setSelectedLink }) {
    const targetNode = selectedNode || filteredTreeLinks;

    const links = useMemo(() => {
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
        return newLinksList;
    }, [targetNode]);

    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const prevTargetRef = useRef(targetNode);
    const loadMoreRef = useRef(null);

    let effectiveVisibleCount = visibleCount;
    if (prevTargetRef.current !== targetNode) {
        prevTargetRef.current = targetNode;
        effectiveVisibleCount = PAGE_SIZE;
    }

    useEffect(() => {
        setVisibleCount(PAGE_SIZE);
    }, [targetNode]);

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
                <span className="links-selected-label">
                    Currently selected node: {selectedNode && (selectedNode.name || selectedNode.login)}
                </span>
                <div className="links-list-card">
                    {visibleLinks.map(x => <LinkItem key={x._id} link={x} editLink={editLink} refreshTreeLink={refreshTreeLink} />)}
                    {effectiveVisibleCount < links.length && (
                        <div ref={loadMoreRef} style={{ height: '1px' }} />
                    )}
                </div>
            </div>
        )
    else {
        return (
            <EditLink setMode={setMode} selectedNode={selectedNode} link={selectedLink} refreshTreeLink={refreshTreeLink} />
        )
    }
}

export default React.memo(Links);