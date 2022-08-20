import axios from 'axios'
import { config } from '../config.js'



async function getTree() {
    const response = await axios.get(`${config.PATH_BASE}/Tree`)
    return response.data;
}

const service={
    getTree
}

export default service