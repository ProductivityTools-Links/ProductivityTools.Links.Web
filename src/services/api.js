import axios from 'axios'
import { config } from '../config.js'
import { toast } from 'react-toastify';


async function invokeCallWithToast(call, pendingMessage, successMessage) {
    return toast.promise(
        invokeCall(call),
        {
            pending: pendingMessage ? pendingMessage : "Missing pending message",
            success: successMessage ? successMessage : "Missing sucesss message",
            error: {
                render({ data }) {
                    console.log(data);
                    return <p>{data.message} [{data.response.data.message}]</p>
                }
            }
        }
    )
}


async function invokeCall(call) {
    let token = localStorage.getItem('token')
    console.log("token from localstorage", token)
    const header = { headers: { Authorization: `Bearer ${token}` } }
    const response = call(header);
    return response;
}

async function getDate() {
    const response = await axios.get(`${config.PATH_BASE}/Date`)
    return response.data;
}

async function getTree() {

    let call = async (header) => {
        //const response = await axios.post(`${config.PATH_BASE}pallet`, pallet, header)
        const response = await axios.get(`${config.PATH_BASE}/Tree`, header)
        return response.data;
    }
    return invokeCall(call);
}

async function getTreeLinks(login) {

    let call = async (header) => {
        //const response = await axios.post(`${config.PATH_BASE}pallet`, pallet, header)
        const response = await axios.get(`${config.PATH_BASE}/TreeLinks/${login}`, header)
        return response.data;
    }
    return invokeCall(call);
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

async function getAccounts() {
    let call = async (header) => {
        const response = await axios.get(`${config.PATH_BASE}/AccountList`, header);
        return response.data;
    }
    let r = invokeCallWithToast(call, "Getting accounts", "Accounts retrieved");
    return r;
}

const service = {
    getDate,
    getTree,
    getTreeLinks,
    addNode,
    getLinks,
    addLink,
    moveLink,
    moveTreeItem,
    getAccounts
}

export default service