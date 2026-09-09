import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import EditLink from './EditLink.js'
import service from '../../services/api';
import LinkItem from './LinkItem';
import Stack from '@mui/material/Stack'

function Links({ selectedNode, filteredTreeLinks, refreshTreeLink }) {

    const [mode, setMode] = useState('list')
    const [links, setLinks] = useState([])
    const [selectedLink, setSelectedLink] = useState(null)

    useEffect(() => {
        // const call = async () => {
        //     if (selectedNode) {
        //         let r = await service.getLinks(selectedNode.id);
        //         console.log("setLinks")
        //         setLinks(r);
        //         console.log(links);
        //     }
        // }
        // call();
        let newLinksList = [];
        const flatLinkList = (currNode) => {
            if (!currNode || !currNode.child) return;

            currNode.child.filter((x) => x._type === "Link").forEach(link => {
                if (!newLinksList.some(item => item._id === link._id)) {
                    newLinksList.push(link);
                }
            });

            currNode.child.filter((x) => x._type === "Node").forEach(childNode => {
                if (currNode === targetNode && (childNode._id === "authors" || childNode.name === "Authors")) {
                    return;
                }
                flatLinkList(childNode);
            });
        }

        console.log("selectedNode", selectedNode);
        console.log("filteredTreeLinks", filteredTreeLinks);
        const targetNode = selectedNode || filteredTreeLinks;
        if (targetNode != null) {
            flatLinkList(targetNode);
            setLinks(newLinksList);
        } else {
            setLinks([]);
        }
    }, [filteredTreeLinks, selectedNode])

    const editLink = (link) => {
        //console.log(link);
        setSelectedLink(link);
        setMode('new')
    }

    const newLink = () => {
        setSelectedLink(null);
        setMode('new')
    }

    if (mode == 'list')
        return (

            <div>
                <span>Currently selected node: {selectedNode && (selectedNode.name || selectedNode.login)}</span>
                <Stack spacing={2}>
                    {links && links.map(x => <LinkItem key={x._id} link={x} editLink={editLink} refreshTreeLink={refreshTreeLink}  />)}
                </Stack>
                <Button variant="contained" onClick={newLink}>Add New</Button>
                <span>List of Links</span>
            </div>
        )
    else {
        return (
            <EditLink setMode={setMode} selectedNode={selectedNode} link={selectedLink} refreshTreeLink={refreshTreeLink} />
        )
    }
}

export default Links;