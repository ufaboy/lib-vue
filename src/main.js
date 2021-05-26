import {createApp} from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import toaster from "@meforma/vue-toaster";

const app = createApp(App)

//styles
import '@/assets/style.scss'
//styles

//self plugins
// import improvedFetch from "@/plugins/fetch/improvedFetch";
import modal from "@/plugins/modal/engine";
import scroll from "@/plugins/scroll/engine"
import observer from "@/plugins/IntersectionObserver";
import loader from "@/plugins/loader"
// import toaster from "@/plugins/toaster/engine";
//self plugins

//components
import LayoutAuth from "@/layouts/LayoutAuth";
import LayoutDefault from "@/layouts/LayoutDefault";
//components


const requireComponent = require.context(
	// Относительный путь к каталогу с компонентами
	'./components',
	// Выполнять (или нет) ли поиск во вложенных каталогах
	false,
	// Регулярное выражение для сопоставления имён файлов базовых компонентов
	/Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
	// Получение конфигурации компонента
	const componentConfig = requireComponent(fileName)

	// Получение имени компонента в PascalCase
	const componentName = fileName
		.split('/')
		.pop()
		.replace(/\.\w+$/, '')

	app.component(componentName.split(/(?=[A-Z])/).join('-').toLowerCase(),
		// Поиск опций компонента в `.default`, который будет существовать,
		// если компонент экспортируется с помощью `export default`,
		// а в противном случае — возврат к корню модуля.
		componentConfig.default || componentConfig
	)
})

	app.use(store)
		.use(router)
		.component('layout-default', LayoutDefault)
		.component('layout-auth', LayoutAuth)
		.use(modal, modal)
		.use(observer)
		.use(scroll, scroll)
		.use(loader, loader)
		.use(toaster)
		// .use(toaster, toaster, {time: 5000})
	app.mount('#app')
