export default {
  install(Vue) {
    Vue.component('observer', require('./observer.vue').default)
  }
}
