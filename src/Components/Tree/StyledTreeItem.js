import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import service from '../../services/api.js';

function StyledTreeItem({ element, isExpanded, hasChildren, onToggle, treeLabelClick, refreshTreeLink, children }) {
    const nodeId = element._id.toString();

    const moveItem = async (id, targetParentId) => {
        console.log("moveItem", id, targetParentId);
        await service.moveLink(id, targetParentId);
        refreshTreeLink();
    };

    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'treeItem',
        item: element,
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [element]);

    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: 'treeItem',
            drop: (e) => moveItem(e._id, element._id),
            collect: (monitor) => ({
                isOver: !!monitor.isOver()
            })
        }),
        [element._id, refreshTreeLink]
    );

    return (
        <li ref={drag} className="MuiTreeItem-root" role="treeitem" contextmenuid={element._id}>
            <div
                className="MuiTreeItem-content"
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
                <div className="MuiTreeItem-label" ref={drop}>
                    <button className="treebutton" onClick={(e) => treeLabelClick(e, element)}>
                        {element.name}
                    </button>
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