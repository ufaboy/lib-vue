export default {
  install(app) {
    app.component('modal', require('./modal.vue').default)
    app.config.globalProperties.$modal = {
      show(name, options) {
        console.log({'editGenre': this, 'app': app, 'options': options, 'refs': options.$refs[name]})
        options.$refs[name].show(options)
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
