// import LoaderModule from "./LoaderModule";

export default {
  install(app) {
    app.component('LoaderModule', require('./LoaderModule.vue').default)
    app.config.globalProperties.$loader = function (status) {
      if (status === 'show') {
        // loader.showLoader()
      } else {
        // loader.hideLoader()
      }

    }
    const mountNode = document.createElement('div')
    mountNode.id = 'loaderNode'
    mountNode.ref = 'loaderRef'
    document.body.appendChild(mountNode)
    // let loaderComp = app.extend(LoaderModule)
    // let loader = new loaderComp().$mount('#loaderNode')
  }
}
