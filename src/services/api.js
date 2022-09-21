import axios from 'axios'
import { config } from '../config.js'

async function getDate(){
    const response=await axios.get(`${config.PATH_BASE}/Date`)
    return response.data;
}

async function getTree() {
    const response = await axios.get(`${config.PATH_BASE}/Tree`)
    return response.data;
}

async function addNode(parentId, name) {
    console.log("parentId"); console.log(parentId)
    const data = { parentId: parentId, name: name }
    const response = await axios.post(`${config.PATH_BASE}/Tree`, data)
}

async function getLinks(selectedNodeId) {
    console.log("getLinks")
    const response = await axios.get(`${config.PATH_BASE}/Link/${selectedNodeId}`);
    return response.data;
}

async function addLink(parentId, name, url, description) {
    console.log("addLink")
    const data = { parentId: parentId, name: name, url: url, description: description }
    const response = await axios.post(`${config.PATH_BASE}/Link`, data)
}

async function moveLink(id, targetParentId) {
    const data = { id: id, targetParentId: targetParentId }
    const response = await axios.post(`${config.PATH_BASE}/Relation`, data)
}

async function moveTreeItem(id, targetParentId) {
    const data = { id: id, targetParentId: targetParentId }
    const response = await axios.post(`${config.PATH_BASE}/Relation`, data)
}

const service = {
    getDate,
    getTree,
    addNode,
    getLinks,
    addLink,
    moveLink,
    moveTreeItem
}

export default service