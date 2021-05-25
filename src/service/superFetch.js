const token = sessionStorage.getItem('lib-token') ?? ''
const Bearer = `Bearer ${token}`;

export async function goPage(url) {
	const response = await fetch(url, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			Authorization: Bearer
		}
	})
	return await response.json();
}

export async function $get(rawUrl) {
	const url = `${process.env.VUE_APP_API_URL}${rawUrl}`;
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			Authorization: Bearer
		}
	})
	return await response.json();
}

export async function $post(rawUrl, data = null) {
	const url = `${process.env.VUE_APP_API_URL}${rawUrl}`;
	const response = await fetch(url, {
		method: 'POST',
		body: data ? JSON.stringify(data) : data,
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			Authorization: Bearer
		}
	})
	return await response.json();
}

export async function $patch(rawUrl, data = null) {
	const url = `${process.env.VUE_APP_API_URL}${rawUrl}`;
	const response = await fetch(url, {
		method: 'PATCH',
		body: data ? JSON.stringify(data) : data,
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			Authorization: Bearer
		}
	})
	return await response.json();
}

export async function $delete(rawUrl, data = null) {
	const url = `${process.env.VUE_APP_API_URL}${rawUrl}`;
	const response = await fetch(url, {
		method: 'PATCH',
		body: data ? JSON.stringify(data) : data,
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			Authorization: Bearer
		}
	})
	return await response.json();
}



