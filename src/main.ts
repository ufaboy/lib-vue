import {createApp} from 'vue'
import {router} from './router';
import App from './App.vue'
import { registerSW } from 'virtual:pwa-register'

const app = createApp(App);

const updateSW = registerSW({
    onNeedRefresh() {},
    onOfflineReady() {},
  })
  
//styles
import '../src/assets/main.scss'
//styles

//self plugins
import scroll from "./plugins/scroll";
import observer from "./plugins/IntersectionObserver";
import loader from "./plugins/loader";
//self plugins

app.use(router).use(observer)
    .use(scroll)
    .use(loader, loader);

app.mount('#app');
export {app};
