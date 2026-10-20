import React, { useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import service from '../../services/api.js';

export const isRealDbId = (id) => {
    if (id === undefined || id === null || id === 'authors') return false;
    if (typeof id === 'number') return Number.isInteger(id) && id >= 0;
    if (typeof id === 'string' && /^\d+$/.test(id.trim())) return true;
    return false;
};

export const isVirtualNode = (node) => {
    if (!node) return true;
    if (node.isVirtual || node._id === 'authors') return true;
    return !isRealDbId(node._id);
};

export const containsNodeId = (node, targetId) => {
    if (!node || targetId === undefined || targetId === null) return false;
    if (String(node._id) === String(targetId)) return true;
    if (Array.isArray(node.child)) {
        for (let i = 0; i < node.child.length; i++) {
            const child = node.child[i];
            if (child && child._type === 'Node' && containsNodeId(child, targetId)) {
                return true;
            }
        }
    }
    return false;
};

export const canMoveItemToTarget = (draggedItem, targetNode) => {
    if (!draggedItem || !targetNode) return false;
    if (isVirtualNode(draggedItem) || isVirtualNode(targetNode)) return false;
    if (String(draggedItem._id) === String(targetNode._id)) return false;
    if (draggedItem._type === 'Node' && containsNodeId(draggedItem, targetNode._id)) {
        return false;
    }
    return true;
};

export const performMoveTreeOrLinkItem = async (draggedItem, targetNode, refreshTreeLink) => {
    if (!canMoveItemToTarget(draggedItem, targetNode)) {
        return;
    }
    const itemId = Number(draggedItem._id);
    const targetParentId = Number(targetNode._id);
    console.log("moveItem", itemId, targetParentId);
    if (draggedItem._type === 'Node') {
        await service.moveTreeItem(itemId, targetParentId);
    } else {
        await service.moveLink(itemId, targetParentId);
    }
    if (refreshTreeLink) {
        refreshTreeLink();
    }
};

function StyledTreeItem({ element, isExpanded, hasChildren, onToggle, treeLabelClick, refreshTreeLink, children }) {
    const nodeId = element._id.toString();
    const isAuthorsTree = Boolean(element.isVirtual || element._id === 'authors');
    const isAuthorsRoot = element._id === 'authors';

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'treeItem',
        item: element,
        canDrag: () => !isVirtualNode(element),
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [element]);

    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: 'treeItem',
            canDrop: (draggedItem) => canMoveItemToTarget(draggedItem, element),
            drop: (draggedItem, monitor) => {
                if (monitor.didDrop()) {
                    return;
                }
                performMoveTreeOrLinkItem(draggedItem, element, refreshTreeLink);
            },
            collect: (monitor) => ({
                isOver: Boolean(monitor.isOver({ shallow: true }) && monitor.canDrop()),
            })
        }),
        [element, refreshTreeLink]
    );

    const setRowRef = useCallback((node) => {
        drag(drop(node));
    }, [drag, drop]);

    const itemColor = element.archived
        ? '#9ca3af'
        : isAuthorsTree
            ? '#1d4ed8'
            : undefined;

    return (
        <li className="MuiTreeItem-root" role="treeitem" contextmenuid={element._id}>
            <div
                ref={setRowRef}
                className="MuiTreeItem-content"
                style={isAuthorsTree ? { color: '#1d4ed8' } : undefined}
                onClick={() => hasChildren && onToggle(nodeId)}
            >
                <div className="MuiTreeItem-iconContainer">
                    {hasChildren && (
                        isExpanded ? (
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
                        style={itemColor ? { color: itemColor, fontWeight: isAuthorsRoot ? 600 : undefined } : undefined}
                        onClick={(e) => treeLabelClick(e, element)}
                    >
                        {element.name}
                    </button>
                    {isAuthorsRoot && (
                        <span
                            style={{
                                marginLeft: '6px',
                                fontSize: '10px',
                                color: '#1d4ed8',
                                backgroundColor: '#dbeafe',
                                border: '1px solid #93c5fd',
                                padding: '1px 5px',
                                borderRadius: '4px',
                                fontWeight: 600,
                                verticalAlign: 'middle',
                            }}
                        >
                            Autogenerated
                        </span>
                    )}
                    {isDragging && <span>😱</span>}
                    {isOver && <span> Drop Here!</span>}
                </div>
            </div>
            {isExpanded && children && (
                <ul className="MuiTreeItem-group" role="group">
                    {children}
                </ul>
            )}
        </li>
    );
}

export default React.memo(StyledTreeItem);