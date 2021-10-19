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
import scroll from "@/plugins/scroll";
import observer from "@/plugins/IntersectionObserver";
import loader from "@/plugins/loader";
//self plugins

app.use(store)
    .use(router)
    .use(observer)
    .use(scroll)
    .use(loader, loader)

app.mount('#app')
