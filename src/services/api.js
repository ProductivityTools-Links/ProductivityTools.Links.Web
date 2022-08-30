import axios from 'axios'
import { config } from '../config.js'



async function getTree() {
    const response = await axios.get(`${config.PATH_BASE}/Tree`)
    return response.data;
}

async function addNode(parentId, name) {
    console.log("parentId"); console.log(parentId)
    const data = { parentId: parentId, name: name }
    const response = await axios.post(`${config.PATH_BASE}/Tree`, data)
}

async function getLinks(){
    console.log("getLinks")
    const response=await axios.get(`${config.PATH_BASE}/Link`);
    return response.data;
}

async function addLink(parentId, name, url, description) {
    console.log("addLink")
    const data = { parentId: parentId, name: name, url: url, description: description }
    const response= await axios.post(`${config.PATH_BASE}/Link`, data)
}

const service = {
    getTree,
    addNode,
    getLinks,
    addLink
}

export default service