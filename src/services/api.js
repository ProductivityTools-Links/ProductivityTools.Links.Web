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

const service = {
    getTree,
    addNode
}

export default service