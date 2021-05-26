export default {
  install(app) {
    app.component('observer', require('./observer.vue').default)
  }
}
