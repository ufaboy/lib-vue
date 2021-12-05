import {createApp} from 'vue'
import LoaderModule from "./LoaderModule.vue";

export interface Loader {
	show: Function,
	hide: Function	
}
export default {
 // @ts-expect-error
	install(app) {
		app.component('LoaderModule', LoaderModule)
		const mountNode = document.createElement('div')
		mountNode.id = 'loaderNode'
		// @ts-expect-error
		mountNode.ref = 'loaderRef'
		document.body.appendChild(mountNode)
		let loader = createApp(LoaderModule).mount('#loaderNode')
		// @ts-expect-error
		app.provide('loader', {show: loader.show, hide: loader.hide})
	}
}
