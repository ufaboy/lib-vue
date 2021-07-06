import {createApp} from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

const app = createApp(App)

//styles
import '@/assets/main.scss'
//styles

//self plugins
import improvedFetch from "@/plugins/fetch/improvedFetch";
import modal from "@/plugins/modal";
import scroll from "@/plugins/scroll"
import observer from "@/plugins/IntersectionObserver";
import loader from "@/plugins/loader"
import toaster from "@/plugins/toaster";
import autoFocus from "@/plugins/focus";
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
		.use(modal)
		.use(observer)
		.use(scroll)
		.use(autoFocus)
		.use(improvedFetch, {API_URL: process.env.VUE_APP_API_URL, API_TOKEN: sessionStorage.getItem('lib-token')})
		.use(loader, loader)
		.use(toaster, {time: 1000, position: 'top-right'})
		// .use(toaster, toaster, {time: 5000})
	app.mount('#app')
