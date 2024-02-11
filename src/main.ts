import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {router} from './router';
import observer from './plugins/IntersectionObserver';
import toaster from './plugins/toaster'
import tableNav from './directives/TableArrowNav';
import lazyLoad from './directives/LazyLoadDirective';
import clickOutside from './directives/ClickOutsideDirective';

import App from './App.vue'
import './assets/style/main.css'
import './assets/style/tailwind.css'


const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(observer)
app.use(toaster)
app.directive('table-nav', tableNav)
app.directive('lazy-load', lazyLoad)
app.directive('click-outside', clickOutside)
app.mount('#app')

console.log('__APP_VERSION__', __APP_VERSION__)
