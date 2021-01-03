const makeRequest = async (url, method = 'GET', data = {}) => {
    const options = {
        method: method,
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
    };

    if (data) {
        if (method === 'POST') {
            const fd = new FormData();

            for (const valueName in data) {
                fd.append(valueName, data[valueName]);
            }

            options.body = fd;
        } else if (method === 'GET') {
            url += `${url.includes('?')?'&':'?'}${(new URLSearchParams(data))}`;
        }
    }

    return await fetch(url, options);
}

const makeActionRequest = async (action, method = 'GET', data = {}) => await makeRequest(`actions.php?action=${action}`, method, data);

const getAction = async (action, data = {}) => await makeActionRequest(action, 'GET', data);

const postAction = async (action, data = {}) => await makeActionRequest(action, 'POST', data);