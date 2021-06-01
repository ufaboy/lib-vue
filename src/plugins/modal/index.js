export default {
  install(app) {
    app.component('modal', require('./modal.vue').default)
    app.config.globalProperties.$modal = {
      show(name, compContext, options) {
        compContext.$refs[name].show(options)
    },
      hide(name, compContext) {
        console.log({'compContext': compContext})
        compContext.$refs[name].hide()
      }
    }

    // app.config.globalProperties.$showModal = function (name) {
    //   this.$refs[name].show()
    // };
    // app.config.globalProperties.$closeModal = function () {
    //   this.$parent.close()
    // }
  }
}
