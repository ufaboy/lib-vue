import toaster from "./toaster";

export default {
  install(app, option) {
    app.component('toaster', require('./toaster.vue').default)
    app.config.globalProperties.$toast = function (type = 'info', message) {
      toast.printMessage(type, option.time, message)
    }
    const mountNode = document.createElement('div')
    mountNode.id = 'mount-node'
    mountNode.ref = 'toastRef'
    document.body.appendChild(mountNode)
    let toastComp = app.extend(toaster)
    console.log({'toastComp': toastComp})
    let toast = new toastComp().mount('#mount-node')
  }
}
