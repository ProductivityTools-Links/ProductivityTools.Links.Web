import axios from 'axios'
import { config } from '../config.js'
import { toast } from 'react-toastify';
import { RepeatOneSharp } from '@mui/icons-material';


async function invokeCallWithToast(call, pendingMessage, successMessage) {
    return toast.promise(
        invokeCall(call),
        {
            pending: pendingMessage ? pendingMessage : "Missing pending message",
            success: successMessage ? successMessage : "Missing sucesss message",
            error: {
                render({ data }) {
                    console.log(data);
                    return <p>{data.message} [{data.response?.data?.message}, {data?.message}]</p>
                }
            }
        }
    )
}


async function invokeCall(call) {
    let token = localStorage.getItem('token')
    console.log("token from localstorage", token)
    const header = { headers: { Authorization: `Bearer ${token}` } }
    try {
        const response = await call(header);
        //   debugger;
        return response;
    } catch (error) {
        console.log("Call endpoint");
        console.log(error);
        throw error;
    }
}

async function getDate() {
    const response = await axios.get(`${config.PATH_BASE}/Date`)
    return response.data;
}

// async function getTree() {

//     let call = async (header) => {
//         //const response = await axios.post(`${config.PATH_BASE}pallet`, pallet, header)
//         const response = await axios.get(`${config.PATH_BASE}/Tree`, header)
//         return response.data;
//     }
//     return invokeCall(call);
// }

async function getTreeLinks(login) {
    console.log("getTreeLinks")
    let call = async (header) => {
        //const response = await axios.post(`${config.PATH_BASE}pallet`, pallet, header)
        const response = await axios.get(`${config.PATH_BASE}/TreeLinks/${login}`, header)
        return response.data;
    }
    return invokeCallWithToast(call, "Getting TreeLinks", "TreeLinks refreshed");
}

async function addNode(parentId, name) {
    let call = async (header) => {
        console.log("parentId"); console.log(parentId)
        const data = { parentId: parentId, name: name }
        const response = await axios.post(`${config.PATH_BASE}/Tree`, data)
    }
    return invokeCallWithToast(call, "New node requested", "New node created")
}

async function getLinks(selectedNodeId) {
    let call = async (header) => {
        console.log("getLinks")
        const response = await axios.get(`${config.PATH_BASE}/Link/${selectedNodeId}`);
        return response.data;
    }
    return invokeCallWithToast(call, "request links", "links returned")
}

async function updateLink(id, parentId, name, url, description, authors) {
    console.log("updateLink")
    let call = async (header) => {
        const data = { id: id, parentId: parentId, name: name, url: url, description: description, authors: authors }
        debugger;
        const response = await axios.post(`${config.PATH_BASE}/Link`, data, header)
        return response.data;
    }
    return invokeCallWithToast(call, "Creating new Link", "New link created!")
}

async function moveLink(id, targetParentId) {
    let call = async (header) => {
        const data = { id: id, targetParentId: targetParentId }
        const response = await axios.post(`${config.PATH_BASE}/Relation`, data, header)
        return response.data;
    }
    return invokeCallWithToast(call, "Move link", "Link moved")
}

async function moveTreeItem(id, targetParentId) {
    let call = async (header) => {
        const data = { id: id, targetParentId: targetParentId }
        const response = await axios.post(`${config.PATH_BASE}/Relation`, data)
        return response.data;
    }
    return invokeCallWithToast(call, "Move TreeItem", "Tree item moved");
}

async function getAccounts() {
    let call = async (header) => {
        const response = await axios.get(`${config.PATH_BASE}/AccountList`, header);
        return response.data;
    }
    let r = invokeCallWithToast(call, "Getting accounts", "Accounts retrieved");
    return r;
}

async function createAccountIfNotExists() {
    let call = async (header) => {
        const response = await axios.get(`${config.PATH_BASE}/Account`, header);
        return response.data;
    }
    let r = invokeCallWithToast(call, "Creating account if not exists", "Creating account done");
    return r;
}

const service = {
    getDate,
    // getTree,
    getTreeLinks,
    addNode,
    getLinks,
    updateLink,
    moveLink,
    moveTreeItem,
    getAccounts,
    createAccountIfNotExists
}

export default service