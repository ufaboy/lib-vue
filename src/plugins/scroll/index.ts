export default {
  // @ts-expect-error
  install(app) {
    app.directive('scroll', {
      // @ts-expect-error
      mounted(el, binding) {
        let f = function (evt:Event) {
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
