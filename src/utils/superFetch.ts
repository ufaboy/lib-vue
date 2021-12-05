import { router } from '../router';
import  {API_URL} from "../../runtimeEnv";
import { BookData } from '../interfaces/book';

// @ts-expect-error
async function $goPage(url:string): Promise<BookData> {
    const token = sessionStorage.getItem('lib-token')
    if (!token) {
        throw new Error(`Token Error: token: ${token}`)
    }
    const response = await fetch(url, {
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

async function $get(rawUrl:string) {
    try {
        const token = sessionStorage.getItem('lib-token')
        const url = `${API_URL}${rawUrl}`;
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
        }
    } catch (e) {
        console.log({'catch $get': e})
    }

}

async function $post(rawUrl:string, data:any = null) {
    try {
        const token = sessionStorage.getItem('lib-token')
        const url = `${API_URL}${rawUrl}`;
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

async function $patch(rawUrl:string, data: any = null) {
    const token = sessionStorage.getItem('lib-token')
    const url = `${API_URL}${rawUrl}`;
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

async function $delete(rawUrl:string, data:any = null) {
    const token = sessionStorage.getItem('lib-token')
    const url = `${API_URL}${rawUrl}`;
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

export {$goPage, $get, $post, $patch, $delete}


