async function $goPage(url) {
    const token = sessionStorage.getItem('lib-token')
    if (!token) {
        console.log({token: token})
    }
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: `Bearer ${token}`
        }
    })
    if (response.ok) {
        return response.json();
    } else {
        return Promise.reject(response);
    }
}

async function $get(rawUrl) {
    const token = sessionStorage.getItem('lib-token')
    const url = `${process.env.VUE_APP_API_URL}${rawUrl}`;
    if (!token) {
        console.log({token: token})
    }
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: `Bearer ${token}`
        }
    })
    if (response.ok) {
        return response.json();
    } else {
        return Promise.reject(response);
    }
}

async function $post(rawUrl, data = null) {
    const token = sessionStorage.getItem('lib-token')
    const url = `${process.env.VUE_APP_API_URL}${rawUrl}`;
    if (!token) {
        console.log({token: token})
    }
    const response = await fetch(url, {
        method: 'POST',
        body: data ? JSON.stringify(data) : data,
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: `Bearer ${token}`
        }
    })
    if (response.ok) {
        return response.json();
    } else {
        return Promise.reject(response);
    }
}

async function $patch(rawUrl, data = null) {
    const token = sessionStorage.getItem('lib-token')
    const url = `${process.env.VUE_APP_API_URL}${rawUrl}`;
    if (!token) {
        console.log({token: token})
    }
    const response = await fetch(url, {
        method: 'PATCH',
        body: data ? JSON.stringify(data) : data,
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: `Bearer ${token}`
        }
    })
    if (response.ok) {
        return response.json();
    } else {
        return Promise.reject(response);
    }
}

async function $delete(rawUrl, data = null) {
    const token = sessionStorage.getItem('lib-token')
    const url = `${process.env.VUE_APP_API_URL}${rawUrl}`;
    if (!token) {
        console.log({token: token})
    }
    const response = await fetch(url, {
        method: 'PATCH',
        body: data ? JSON.stringify(data) : data,
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: `Bearer ${token}`
        }
    })
    if (response.ok) {
        return response.json();
    } else {
        return Promise.reject(response);
    }
}

export {$goPage, $get, $post, $patch, $delete}



