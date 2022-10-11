import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import NewLink from './NewLink.js'
import service from '../../services/api';
import LinkItem from './LinkItem';
import Stack from '@mui/material/Stack'

function Links({ selectedNode, filteredTreeLinks, refreshTreeLink }) {

    const [mode, setMode] = useState('list')
    const [links, setLinks] = useState([])

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
        const flatLinkList = (filteredTreeLinks, addLinks) => {

            if (addLinks) {
                if (filteredTreeLinks.links != undefined) {
                    filteredTreeLinks.links.forEach(link => {

                        newLinksList.push(link)
                    });
                }
            }

            if (filteredTreeLinks.nodes != undefined) {
                filteredTreeLinks.nodes.forEach(node => {
                    flatLinkList(node, addLinks || node.id == selectedNode.id)
                });
            }
        }

        if (selectedNode != null && filteredTreeLinks != null) {
            console.log("linkd2s");
            console.log(filteredTreeLinks);
            console.log(selectedNode);
            console.log(selectedNode?.id == filteredTreeLinks?.id);
            flatLinkList(filteredTreeLinks, selectedNode.id == filteredTreeLinks.id);
            console.log(links)
            setLinks(newLinksList);
        }
    }, [filteredTreeLinks, selectedNode])

    if (mode == 'list')
        return (

            <div>
                <span>Currently selected node: {selectedNode && selectedNode.name}</span>
                <Stack spacing={2}>
                    {links && links.map(x => <LinkItem key={x.id} link={x} />)}
                </Stack>
                <Button variant="contained" onClick={() => setMode('new')}>Add New</Button>
                <span>List of Links</span>
            </div>
        )
    else {
        return (
            <NewLink setMode={setMode} selectedNode={selectedNode} refreshTreeLink={refreshTreeLink} />
        )
    }
}

export default Links;