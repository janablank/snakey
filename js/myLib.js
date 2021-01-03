const makeRequest = async (url, method = 'GET', data = {}) => {
    const options = {
        method: method,
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
    };

    if (method === 'POST') {
        const fd = new FormData();

        for (const valueName in data) {
            fd.append(valueName, data[valueName]);
        }

        options.body = fd;
    }else if (method === 'GET') {

    }

    return await fetch(url, options);
}

const makeActionRequest = async (action, method = 'GET', data = {}) =>{
    return await makeRequest(`ajax.php?action=${action}`, method, data);
}

const getRequest = async (action, data = {}) => {
    return await makeActionRequest(action, 'GET', data);
}

const postRequest = async (action, data = {}) => {
    return await makeActionRequest(action, 'POST', data);
}

