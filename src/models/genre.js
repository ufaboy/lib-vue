class genre {
  _token = `Bearer ${$nuxt.$root.$store.state.auth.token}`;
  constructor(name) {
    this.id = null;
    this.name = name;
    this.description = null;
    this.parent_id = null;
    this.ad = null
  }
  async create() {
    const result = await this.send('POST', `${$nuxt.$root.$config.apiUrl}/genre/create`)
    if (result) {
      this.assignResult(result)
    }
  };
  update() {
    return this.send('GET', `${$nuxt.$root.$config.apiUrl}/genre/view?id=${id}`)
  };
  async view(id) {
    const result = await this.send('GET', `${$nuxt.$root.$config.apiUrl}/genre/view?id=${id}`)
    if (result) {
      this.assignResult(result)
    }
    return this
  };
  async send(method, rawUrl) {
    const url = $nuxt.$root.$config.apiUrl + rawUrl;
    const response = await fetch(url , {
      method: method,
      body: this.getGenre(),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: this._token
      }
    })
    return await response.json();
  };
  assignResult(result) {
    this.id = result.id;
    this.name = result.name;
    this.description = result.description;
    this.parent_id = result.parent_id;
    this.ad = result.ad
  }
  getGenre() {
    let formData = {
      name: this.name,
      description: this.description,
      parent_id: this.parent_id,
      ad: this.ad
    }
    if (this.id) {
      formData.id = this.id
    }
    return formData
  }
}
module.exports = genre
