import router from "@/router";

async function $get(rawUrl) {
    try {
        const token = sessionStorage.getItem('lib-token')
        const url = `${process.env.VUE_APP_API_URL}${rawUrl}`;
        if (!token) {
            throw new Error(`Token Error: token: ${token}`)
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${token}`
            }
        })
        if (response.ok) {
            return await response.json();
        } else if (response.status === 401) {
            router.push('/login')
        } else {
            throw new Error(`HTTP Error: status: ${response.status}, message: ${response.statusText}`)
            // return Promise.reject(response)
        }
    } catch (e) {
        console.log({'catch $get': e})
    }

}

async function $post(rawUrl, data = null) {
    try {
        const token = sessionStorage.getItem('lib-token')
        const url = `${process.env.VUE_APP_API_URL}${rawUrl}`;
        if (!token) {
            throw new Error(`Token Error: token: ${token}`)
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
            return await response.json();
        } else if (response.status === 401) {
            router.push('/login')
        } else {

            return Promise.reject(response)
        }
    } catch (e) {
        console.log({'$post': e})
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
        return await response.json();
    } else if (response.status === 401) {
        router.push('/login')
    } else {
        console.log({'$patch': response})
        return Promise.reject(response)
    }
}

async function $delete(rawUrl, data = null) {
    const token = sessionStorage.getItem('lib-token')
    const url = `${process.env.VUE_APP_API_URL}${rawUrl}`;
    if (!token) {
        throw new Error(`Token Error: token: ${token}`)
    }
    const response = await fetch(url, {
        method: 'DELETE',
        body: data ? JSON.stringify(data) : data,
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: `Bearer ${token}`
        }
    })
    if (response.ok) {
        return await response.json();
    } else if (response.status === 401) {
        router.push('/login')
    } else {
        console.log({'$delete': response})
        return Promise.reject(response)
    }
}

export { $get, $post, $patch, $delete}


