import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import LayoutAuth from "@/layouts/LayoutAuth";
import LayoutDefault from "@/layouts/LayoutDefault";



createApp(App)
    .use(store)
    .use(router)
    .component('layout-default', LayoutDefault)
    .component('layout-auth', LayoutAuth)
    .mount('#app')