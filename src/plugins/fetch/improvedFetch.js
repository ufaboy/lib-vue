export default {
  install(app, options) {
    app.config.globalProperties.$fetch = async function (rawUrl, type = 'GET', data = null) {
      const token = options.token;
      const Bearer = `Bearer ${token}`;
      const url = options.apiUrl + rawUrl;

      const response = await fetch(url , {
        method: type.toUpperCase(),
        body: data ? JSON.stringify(data) : data,
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: Bearer
        }
      })
      return await response.json();
    }
  }
}
