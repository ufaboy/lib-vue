export default {
  install(app, options) {
    // app.config.globalProperties.$fetch = async function (rawUrl, type = 'GET', data = null) {
    //   const token = options.token;
    //   const Bearer = `Bearer ${token}`;
    //   const url = options.apiUrl + rawUrl;
    //
    //   const response = await fetch(url , {
    //     method: type.toUpperCase(),
    //     body: data ? JSON.stringify(data) : data,
    //     headers: {
    //       'Content-Type': 'application/json;charset=utf-8',
    //       Authorization: Bearer
    //     }
    //   })
    //   return await response.json();
    // }
    app.config.globalProperties.goPage = async function (url) {
      const API_TOKEN = sessionStorage.getItem('lib-token')
      if (!API_TOKEN) {
        console.log({token: API_TOKEN})
      }
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Bearer ${API_TOKEN}`
        }
      })
      if (response.ok) {
        return await response.json();
      } else {
        return new Promise(function(resolve, reject) {
          reject(response);
        })
      }
    }

    app.config.globalProperties.$get = async function (rawUrl) {
      const {API_URL} = {...options}
      const API_TOKEN = sessionStorage.getItem('lib-token')
      const url = `${API_URL}${rawUrl}`;
      if (!API_TOKEN) {
        console.log({token: API_TOKEN})
      }
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Bearer ${API_TOKEN}`
        }
      })
      if (response.ok) {
        return await response.json();
      } else {
        return new Promise(function(resolve, reject) {
          reject(response);
        })
      }
    }

    app.config.globalProperties.$post = async function (rawUrl, data = null) {
      const {API_URL} = {...options}
      const API_TOKEN = sessionStorage.getItem('lib-token')
      const url = `${API_URL}${rawUrl}`;
      if (!API_TOKEN) {
        console.log({token: API_TOKEN})
      }
      const response = await fetch(url, {
        method: 'POST',
        body: data ? JSON.stringify(data) : data,
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Bearer ${API_TOKEN}`
        }
      })
      if (response.ok) {
        return await response.json();
      } else {
        return new Promise(function(resolve, reject) {
          reject(response);
        })
      }
    }

    app.config.globalProperties.$patch = async function (rawUrl, data = null) {
      const {API_URL} = {...options}
      const API_TOKEN = sessionStorage.getItem('lib-token')
      const url = `${API_URL}${rawUrl}`;
      if (!API_TOKEN) {
        console.log({token: API_TOKEN})
      }
      const response = await fetch(url, {
        method: 'PATCH',
        body: data ? JSON.stringify(data) : data,
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Bearer ${API_TOKEN}`
        }
      })
      if (response.ok) {
        return await response.json();
      } else {
        return new Promise(function(resolve, reject) {
          reject(response);
        })
      }
    }

    app.config.globalProperties.$delete = async function (rawUrl, data = null) {
      const {API_URL} = {...options}
      const API_TOKEN = sessionStorage.getItem('lib-token')
      const url = `${API_URL}${rawUrl}`;
      if (!API_TOKEN) {
        console.log({token: API_TOKEN})
      }
      const response = await fetch(url, {
        method: 'PATCH',
        body: data ? JSON.stringify(data) : data,
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Bearer ${API_TOKEN}`
        }
      })
      if (response.ok) {
        return await response.json();
      } else {
        return new Promise(function(resolve, reject) {
          reject(response);
        })
      }
    }
  }
}
