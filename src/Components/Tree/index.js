import './index.css';
import ContextMenu from './ContextMenu';
import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import AddNodeModal from './AddNodeModal';
import StyledTreeItem, { canMoveItemToTarget, performMoveTreeOrLinkItem } from './StyledTreeItem.js';
import NodeDeleteDialog from './NodeDeleteDialog.js';
import NodeRenameDialog from './NodeRenameDialog.js';
import service from '../../services/api.js';

const getAllNodeIds = (node, acc = new Set()) => {
    if (!node) return acc;
    if (node._id !== undefined && node._id !== null) {
        acc.add(node._id.toString());
    }
    if (node.child && Array.isArray(node.child)) {
        for (let i = 0; i < node.child.length; i++) {
            const c = node.child[i];
            if (c && (c._type === 'Node' || (c.child && c._type !== 'Link'))) {
                getAllNodeIds(c, acc);
            }
        }
    }
    return acc;
};

function Tree({ structure, filter, setSelectedNode, selectedNode, refreshTreeLink, includeArchived = false, setIncludeArchived }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [nodeDeleteDialogOpen, setnNodeDeleteDialogOpen] = useState(false);
    const [nodeRenameDialogOpen, setNodeRenameDialogOpen] = useState(false);
    const [expanded, setExpanded] = useState(() => new Set());
    const [filterToggled, setFilterToggled] = useState(() => new Set());
    const initialExpandedDoneRef = useRef(false);
    const prevStructureRef = useRef(structure);

    const isFiltering = Boolean(filter && filter.trim() !== '');

    let activeFilterToggled = filterToggled;
    if (prevStructureRef.current !== structure) {
        prevStructureRef.current = structure;
        if (filterToggled.size > 0) {
            activeFilterToggled = new Set();
            setFilterToggled(new Set());
        }
    }

    useEffect(() => {
        if (!structure) return;
        if (!initialExpandedDoneRef.current && structure._id) {
            initialExpandedDoneRef.current = true;
            setExpanded(new Set([structure._id.toString()]));
        }
    }, [structure]);

    const expandedSet = useMemo(() => {
        if (!structure) return new Set();
        if (isFiltering) {
            const allIds = getAllNodeIds(structure);
            if (activeFilterToggled.size > 0) {
                activeFilterToggled.forEach((id) => {
                    if (allIds.has(id)) {
                        allIds.delete(id);
                    } else {
                        allIds.add(id);
                    }
                });
            }
            return allIds;
        }
        if (expanded.size === 0 && structure._id) {
            return new Set([structure._id.toString()]);
        }
        return expanded;
    }, [structure, isFiltering, expanded, activeFilterToggled]);

    const toggleNode = useCallback((nodeId) => {
        if (isFiltering) {
            setFilterToggled((prev) => {
                const next = new Set(prev);
                if (next.has(nodeId)) {
                    next.delete(nodeId);
                } else {
                    next.add(nodeId);
                }
                return next;
            });
        } else {
            setExpanded((prev) => {
                const next = new Set(prev);
                if (next.has(nodeId)) {
                    next.delete(nodeId);
                } else {
                    next.add(nodeId);
                }
                return next;
            });
        }
    }, [isFiltering]);

    const containerRef = useRef(null);

    const handleModalClose = () => {
        setModalOpen(false);
    };
    const handleModalOpen = () => { setModalOpen(true); };

    const findNode = (nodes, id) => {
        if (nodes) {
            for (let i = 0; i < nodes.length; i++) {
                if (nodes[i]._id == id) {
                    return nodes[i];
                } else {
                    let subresult = findNode(nodes[i].child, id);
                    if (subresult != null) {
                        return subresult;
                    }
                }
            }
        }
    };

    const treeLabelClick = useCallback((e, nodeOrId) => {
        e.stopPropagation();
        if (nodeOrId && typeof nodeOrId === 'object') {
            setSelectedNode(nodeOrId);
        } else if (structure) {
            if (structure._id == nodeOrId) {
                setSelectedNode(structure);
            } else {
                let node = findNode(structure.child, nodeOrId);
                setSelectedNode(node);
            }
        }
    }, [structure, setSelectedNode]);

    const nodeDeleteDialogClose = () => { setnNodeDeleteDialogOpen(true); };
    const handleNodeRenameOpen = () => { setNodeRenameDialogOpen(true); };
    const handleNodeRenameClose = () => { setNodeRenameDialogOpen(false); };

    const closeAndRefresh = () => {
        setnNodeDeleteDialogOpen(false);
        setNodeRenameDialogOpen(false);
        refreshTreeLink();
    };

    function GetNode(n) {
        if (!n || !n.child) return null;
        const childNodes = n.child.filter((x) => x._type == "Node").sort((a, b) => a.name < b.name ? -1 : 1);
        if (childNodes.length === 0) return null;

        return childNodes.map(x => {
            const nodeId = x._id.toString();
            const isExpanded = expandedSet.has(nodeId);
            const hasChildren = Boolean(x.child && x.child.some(c => c && c._type === "Node"));
            return (
                <StyledTreeItem
                    element={x}
                    key={x._id}
                    isExpanded={isExpanded}
                    hasChildren={hasChildren}
                    onToggle={toggleNode}
                    treeLabelClick={treeLabelClick}
                    refreshTreeLink={refreshTreeLink}
                >
                    {isExpanded && hasChildren ? GetNode(x) : null}
                </StyledTreeItem>
            );
        });
    }

    const handleToggleArchive = async (treeId) => {
        let targetNode = selectedNode;
        if (treeId !== undefined && treeId !== null && structure) {
            if (structure._id == treeId) {
                targetNode = structure;
            } else {
                const found = findNode(structure.child, treeId);
                if (found) {
                    targetNode = found;
                }
            }
        }
        const idToArchive = targetNode?._id ?? treeId;
        if (idToArchive === undefined || idToArchive === null || idToArchive === 'authors') {
            return;
        }
        const isArchived = Boolean(targetNode?.archived);
        if (isArchived) {
            await service.unarchiveNode(idToArchive);
        } else {
            await service.archiveNode(idToArchive);
        }
        refreshTreeLink();
    };

    const isSelectedArchived = Boolean(selectedNode?.archived);

    const menuItems = [
        {
            text: 'Add new tree item',
            onclick: () => { handleModalOpen(); }
        },
        {
            text: 'Rename',
            onclick: () => { handleNodeRenameOpen(); }
        },
        {
            text: 'Delete',
            onclick: () => { nodeDeleteDialogClose(); }
        },
        {
            text: isSelectedArchived ? 'Unarchive' : 'Archive',
            onclick: (treeId) => { handleToggleArchive(treeId); }
        }
    ];

    const [{ isRootOver }, rootDrop] = useDrop(
        () => ({
            accept: 'treeItem',
            canDrop: (draggedItem) => Boolean(structure && canMoveItemToTarget(draggedItem, structure)),
            drop: (draggedItem, monitor) => {
                if (monitor.didDrop()) {
                    return;
                }
                performMoveTreeOrLinkItem(draggedItem, structure, refreshTreeLink);
            },
            collect: (monitor) => ({
                isRootOver: Boolean(monitor.isOver({ shallow: true }) && monitor.canDrop()),
            }),
        }),
        [structure, refreshTreeLink]
    );

    if (!structure) return null;

    const rootId = structure._id.toString();
    const rootExpanded = expandedSet.has(rootId);
    const rootHasChildren = Boolean(structure.child && structure.child.some(c => c && c._type === "Node"));

    return (
        <div ref={containerRef}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    gap: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <FormControlLabel
                    control={
                        <Switch
                            size="small"
                            checked={Boolean(includeArchived)}
                            onChange={(e) => setIncludeArchived && setIncludeArchived(e.target.checked)}
                            color="primary"
                        />
                    }
                    label={<span style={{ fontSize: '0.85rem', color: '#555' }}>Show archived</span>}
                    style={{ margin: 0, userSelect: 'none' }}
                />
            </div>
            <ul className="MuiTreeView-root" role="tree" aria-label="file system navigator">
                <li className="MuiTreeItem-root" role="treeitem" contextmenuid={structure._id}>
                    <div
                        ref={rootDrop}
                        className="MuiTreeItem-content"
                        onClick={() => rootHasChildren && toggleNode(rootId)}
                    >
                        <div className="MuiTreeItem-iconContainer">
                            {rootHasChildren && (
                                rootExpanded ? (
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                                        <path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                                        <path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                                    </svg>
                                )
                            )}
                        </div>
                        <div className="MuiTreeItem-label">
                            <button
                                type="button"
                                className="treebutton"
                                style={structure.archived ? { color: 'gray' } : undefined}
                                onClick={(e) => treeLabelClick(e, structure)}
                            >
                                {structure.login}
                            </button>
                            {isRootOver && <span> Drop Here!</span>}
                        </div>
                    </div>
                    {rootExpanded && rootHasChildren && (
                        <ul className="MuiTreeItem-group" role="group">
                            {GetNode(structure)}
                        </ul>
                    )}
                </li>
            </ul>

            <ContextMenu parentRef={containerRef} items={menuItems}></ContextMenu>
            <AddNodeModal open={modalOpen} selectedNode={selectedNode} handleModalClose={handleModalClose} refreshTreeLink={refreshTreeLink} />
            <NodeRenameDialog open={nodeRenameDialogOpen} selectedNode={selectedNode} closeModal={handleNodeRenameClose} closeAndRefresh={closeAndRefresh} refreshTreeLink={refreshTreeLink} />
            <NodeDeleteDialog open={nodeDeleteDialogOpen} selectedNode={selectedNode} closeModal={() => setnNodeDeleteDialogOpen(false)} closeAndRefresh={closeAndRefresh} refreshTreeLink={refreshTreeLink} ></NodeDeleteDialog>
        </div>
    );
}

export default React.memo(Tree);