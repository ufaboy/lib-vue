import {createApp} from 'vue'
import {router} from './router';
import App from './App.vue'
import { registerSW } from 'virtual:pwa-register'
import {initTheme} from "./utils/theme";

const app = createApp(App);

const updateSW = registerSW({
    onNeedRefresh() {},
    onOfflineReady() {},
  })
  
//styles
import '../src/assets/main.scss'
import './assets/tailwind.css'
//styles

//self plugins
import scroll from "./plugins/scroll";
import observer from "./plugins/IntersectionObserver";
//self plugins

initTheme();

app.use(router).use(observer)
    .use(scroll)

app.mount('#app');
export {app};
