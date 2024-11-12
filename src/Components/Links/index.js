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
        // const flatLinkList = (filteredTreeLinks, addLinks) => {

        //     if (addLinks) {
        //         if (filteredTreeLinks.links != undefined) {
        //             filteredTreeLinks.links.forEach(link => {
        //                 newLinksList.push(link)
        //                 console.log("addLinks",addLinks)
        //                 console.log("newLinksListiteration",newLinksList)
        //             });
        //         }
        //     }
        //     if (filteredTreeLinks.nodes != undefined) {
        //         filteredTreeLinks.nodes.forEach(node => {
        //             flatLinkList(node, addLinks || node.id == selectedNode.id)
        //         });
        //     }
        // }
        const flatLinkList = (selectedNode) => {

            if (selectedNode.child != undefined) {
                selectedNode.child.filter((x) => x._type == "Link").forEach(link => {
                    newLinksList.push(link)

                    console.log("newLinksListiteration", newLinksList)
                });
            }

            if (selectedNode.child != undefined) {
                selectedNode.child.forEach(node => {
                    flatLinkList(node)
                });
            }
        }
        console.log("selectedNode", selectedNode);
        console.log("filteredTreeLinks", filteredTreeLinks);
        if (selectedNode != null && filteredTreeLinks != null) {
            console.log("linkd2s");
            console.log(selectedNode?._id == filteredTreeLinks?._id);
            flatLinkList(selectedNode);
            console.log("oldlinks", links)
            console.log("newLinksList", newLinksList)
            setLinks(newLinksList);
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
                <span>Currently selected node: {selectedNode && selectedNode.name}</span>
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