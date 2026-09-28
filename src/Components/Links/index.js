import { useEffect, useState, useCallback } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import EditLink from './EditLink.js'
import service from '../../services/api';
import LinkItem from './LinkItem';
import './index.css';

function Links({ selectedNode, filteredTreeLinks, refreshTreeLink, mode = 'list', setMode, selectedLink, setSelectedLink }) {

    const [links, setLinks] = useState([])

    useEffect(() => {
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

        const targetNode = selectedNode || filteredTreeLinks;
        if (targetNode != null) {
            flatLinkList(targetNode);
            setLinks(newLinksList);
        } else {
            setLinks([]);
        }
    }, [filteredTreeLinks, selectedNode])

    const editLink = useCallback((link) => {
        //console.log(link);
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
                    {links && links.map(x => <LinkItem key={x._id} link={x} editLink={editLink} refreshTreeLink={refreshTreeLink} />)}
                </div>
            </div>
        )
    else {
        return (
            <EditLink setMode={setMode} selectedNode={selectedNode} link={selectedLink} refreshTreeLink={refreshTreeLink} />
        )
    }
}

export default Links;