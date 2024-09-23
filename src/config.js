const dev = {
    PATH_BASE: 'http://127.0.0.1:5000'
}

const prd = {
    PATH_BASE: 'https://ptlinksprod.uw.r.appspot.com'
    //PATH_BASE: 'https://ptlinkstemp.uc.r.appspot.com'
}

export const config=dev;
//export const config = process.env.NODE_ENV === 'development' ? dev : prd;
