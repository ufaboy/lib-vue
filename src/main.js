import {createApp} from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

//styles
import '@/assets/style.scss'
//styles

//self plugins
import improvedFetch from "@/plugins/fetch/improvedFetch";
//self plugins

//components
import LayoutAuth from "@/layouts/LayoutAuth";
import LayoutDefault from "@/layouts/LayoutDefault";
//components

createApp(App)
	.use(store)
	.use(router)
	.use(improvedFetch, {
		token: `$2y$13$xazgAgbxQe./cGdEuavuaeilY82N.IZLt/Adj8y2GiHBBTTReQfUS`,
		apiUrl: process.env.NODE_ENV === 'development' ? 'http://api.librarydev.site' : 'https://api.librarydev.xyz'
	})
	.component('layout-default', LayoutDefault)
	.component('layout-auth', LayoutAuth)
	.mount('#app')