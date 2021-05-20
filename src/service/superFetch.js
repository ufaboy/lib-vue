export default {
  async $get(rawUrl) {
    const token = sessionStorage.getItem('lib-token') ?? ''
    const Bearer = `Bearer ${token}`;
    const url = `${process.env.VUE_APP_API_URL}${rawUrl}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: Bearer
      }
    })
    return await response.json();
  },
  async $post(rawUrl, data = null) {
    const token = sessionStorage.getItem('lib-token') ?? ''
    const Bearer = `Bearer ${token}`;
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
  },
  async $patch(rawUrl, data = null) {
    const token = sessionStorage.getItem('lib-token') ?? ''
    const Bearer = `Bearer ${token}`;
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
  },
  async $delete(rawUrl, data = null) {
    const token = sessionStorage.getItem('lib-token') ?? ''
    const Bearer = `Bearer ${token}`;
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
}
