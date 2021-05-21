export default {
  install(app) {
    app.component('modal', require('./modal.vue').default)
    app.config.globalProperties.$showModal = function (name) {
      this.$refs[name].show()
    };
    app.config.globalProperties.$closeModal = function (name) {
      console.log(name)
      // this.$parent.close()
    }
  }
}
