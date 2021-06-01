export default {
  install(app) {
    app.directive('scroll', {
      mounted(el, binding) {
        let f = function (evt) {
          console.log({'evt': evt})
          if (binding.value(evt, el)) {
            el.removeEventListener('scroll', f)
          }
        }
        el.addEventListener('scroll', f, {passive: true})
      }
      // mounted: function (el, binding) {
      //   let f = function (evt) {
      //     if (binding.value(evt, el)) {
      //       el.removeEventListener('scroll', f)
      //     }
      //   }
      //   el.addEventListener('scroll', f)
      // }
    })
  }
}
