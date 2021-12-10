import { router } from '../router';
import { BookData } from '../interfaces/book';

// @ts-expect-error
async function $goPage(url:URL): Promise<BookData> {
    const token = sessionStorage.getItem('lib-token')
    if (!token) {
        throw new Error(`Token Error: token: ${token}`)
    }
    const response = await fetch(url.toString(), {
        method: 'PATCH',
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
        console.log({'$goPage': response})
        return Promise.reject(response)
    }
}

async function $get(url:URL) {
    try {
        const token = sessionStorage.getItem('lib-token')
        if (!token) {
            throw new Error(`Token Error: token: ${token}`)
        }

        const response = await fetch(url.toString(), {
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
        }
    } catch (e) {
        console.log({'catch $get': e})
    }

}

async function $post(url:URL, data:any = null) {
    try {
        const token = sessionStorage.getItem('lib-token')
        if (!token) {
            throw new Error(`Token Error: token: ${token}`)
        }
        const response = await fetch(url.toString(), {
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

async function $patch(url:URL, data: any = null) {
    const token = sessionStorage.getItem('lib-token')
    if (!token) {
        console.log({token: token})
    }
    const response = await fetch(url.toString(), {
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

async function $delete(url:URL, data:any = null) {
    const token = sessionStorage.getItem('lib-token')
    if (!token) {
        throw new Error(`Token Error: token: ${token}`)
    }
    const response = await fetch(url.toString(), {
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

export {$goPage, $get, $post, $patch, $delete}


