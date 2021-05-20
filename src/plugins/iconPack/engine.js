export default {
  install(Vue, option) {
    Vue.component('IconBase', require('./icons/IconBase').default)
    Vue.component('IconBook', require('./icons/IconBook').default)
    Vue.component('IconClose', require('./icons/IconClose').default)
    Vue.component('IconMinus', require('./icons/IconMinus').default)
    Vue.component('IconPlus', require('./icons/IconPlus').default)
    Vue.component('IconSortAsc', require('./icons/IconSortAsc').default)
    Vue.component('IconSortDesc', require('./icons/IconSortDesc').default)
    Vue.component('IconCarriage', require('./icons/IconCarriage').default)
    Vue.component('IconParagraph', require('./icons/IconParagraph').default)
    Vue.component('IconSlash', require('./icons/IconSlash').default)
  }
}
