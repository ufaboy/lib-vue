export default {
  install(app) {
    app.component('modal', require('./modal.vue').default)
    app.config.globalProperties.$modal = {
      show(name, options) {
        const elem = document.getElementById(name)
        console.log({'app': app, 'elem': elem, 'name': name, 'options': options})
        // app.$refs[name].show(options)
    },
      hide(name) {
        console.log({'hide': name})
        // app.$refs[name].hide()
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
