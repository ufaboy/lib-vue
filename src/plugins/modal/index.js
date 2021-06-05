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
  }
}
