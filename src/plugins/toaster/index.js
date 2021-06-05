import {createApp} from 'vue'
import ToasterModule from "./ToasterModule";

export default {
  install(app, option) {
    app.component('ToasterModule', require('./ToasterModule.vue').default)
    app.config.globalProperties.$toast = {

      success: function (message, opt) {
        const preparedOption = {type: 'success', ...option, ...opt}
        toaster.printMessage(message, preparedOption)
      },

      info: function (message, opt) {
        const preparedOption = {type: 'info', ...option, ...opt}
        toaster.printMessage(message, preparedOption)
      },
      warning: function (message, opt) {
        const preparedOption = {type: 'warning', ...option, ...opt}
        toaster.printMessage(message, preparedOption)
      },
      error: function (message, opt) {
        const preparedOption = {type: 'error', ...option, ...opt}
        toaster.printMessage(message, preparedOption)
      },
    }
    const mountNode = document.createElement('div')
    mountNode.id = 'toasterNode'
    mountNode.ref = 'toasterRef'
    document.body.appendChild(mountNode)
    let toaster = createApp(ToasterModule).mount('#toasterNode')
  }
}
