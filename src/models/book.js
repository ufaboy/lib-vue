class book {
  _token = `Bearer ${$nuxt.$root.$store.state.auth.token}`;

  constructor(name) {
    this.id = null
    this.name = name
    this.annotation = null
    this.text = null
    this.source = null
    this.cover = null
    this.rating = null
    this.ad = null
    this.files = []
  }

  async create() {
    const result = await this.send('POST', `${$nuxt.$root.$config.apiUrl}/book/create`)
    if (result) {
      this.assignResult(result)
    }
  };

  update() {
    return this.send('GET', `${$nuxt.$root.$config.apiUrl}/book/view?id=${id}`)
  };

  async view(id) {
    const result = await this.send('GET', `${$nuxt.$root.$config.apiUrl}/book/view?id=${id}`)
    if (result) {
      this.assignResult(result)
    }
    return this
  };

  async send(method, rawUrl) {
    const url = $nuxt.$root.$config.apiUrl + rawUrl;
    const response = await fetch(url, {
      method: method,
      body: this.getBook(),
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
    this.annotation = result.annotation;
    this.text = result.text;
    this.source = result.source;
    this.cover = result.cover;
    this.rating = result.rating;
    this.files = result.files;
    this.ad = result.ad
  }

  getBook() {
    let formData = {
      name: this.name,
      annotation: this.annotation,
      text: this.text,
      source: this.source,
      cover: this.cover,
      rating: this.rating,
      files: this.files,
      ad: this.ad
    }
    if (this.id) {
      formData.id = this.id
    }
    return formData
  }
}
