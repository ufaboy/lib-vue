import {createApp} from 'vue'
import LoaderModule from "./LoaderModule";

export default {
	install(app) {
		app.component('LoaderModule', require('./LoaderModule.vue').default)
		app.config.globalProperties.$loader = {
			show: function () {loader.showLoader()},
			hide: function () {loader.hideLoader()}
		}
		const mountNode = document.createElement('div')
		mountNode.id = 'loaderNode'
		mountNode.ref = 'loaderRef'
		document.body.appendChild(mountNode)
		let loader = createApp(LoaderModule).mount('#loaderNode')
	}
}
