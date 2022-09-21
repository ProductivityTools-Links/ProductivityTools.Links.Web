const dev = {
    PATH_BASE: 'http://127.0.0.1:8080'
}

const prd = {
    PATH_BASE: 'https://ptlinksprod.uw.r.appspot.com'
}

//export const config=prd;
export const config = process.env.NODE_ENV === 'development' ? dev : prd;
