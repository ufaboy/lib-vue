

// export default {
//   install(app) {
//     app.component('LoaderModule', require('./LoaderModule.vue').default)
//     app.config.globalProperties.$loader = function (status) {
//       if (status === 'show') {
//         // loader.showLoader()
//       } else {
//         // loader.hideLoader()
//       }
//
//     }
//     const mountNode = document.createElement('div')
//     mountNode.id = 'loaderNode'
//     mountNode.ref = 'loaderRef'
//     document.body.appendChild(mountNode)
//     // app = {extends: LoaderModule}
//     app = {
//       extends: LoaderModule
//     }
//     console.log({'app': app})
//
//     // let loaderComp = app.extend(LoaderModule)
//     LoaderModule.mount('#loaderNode')
//   }
// }
import LoaderModule from "./LoaderModule";
import Api from './api.js'

const Plugin = (app, options = {}) => {
  let methods = Api(options)
  app.$loader = methods
  app.config.globalProperties.$loader = methods
}

LoaderModule.install = Plugin

export default LoaderModule
export { LoaderModule }
