import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import {VitePWA} from 'vite-plugin-pwa'
import VitePluginHtmlEnv from 'vite-plugin-html-env'


// @ts-ignore
export default ({mode}) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};
    return defineConfig({
        plugins: [
            vue(),
            VitePluginHtmlEnv(),
            VitePWA({
                // includeAssets: ['robots.txt'],
                registerType: 'autoUpdate',
                workbox: {
                    cleanupOutdatedCaches: false,
                    sourcemap: true
                },
                manifest: {
                    name: 'My Library',
                    short_name: 'Library',
                    description: 'My library for some text',
                    theme_color: '#3367D6',
                    display: 'standalone',
                    background_color: '#004e92',
                    icons: [
                        {
                            src: "./icons/pwa/maskable_icon_x48.png",
                            sizes: "48x48",
                            type: "image/png",
                            purpose: "maskable"
                        },
                        {
                            src: "./icons/pwa/maskable_icon_x96.png",
                            sizes: "96x96",
                            type: "image/png",
                            purpose: "maskable"
                        },
                        {
                            src: "./icons/pwa/maskable_icon_x72.png",
                            sizes: "72x72",
                            type: "image/png",
                            purpose: "maskable"
                        },
                        {
                            src: "./icons/pwa/maskable_icon_x128.png",
                            sizes: "128x128",
                            type: "image/png",
                            purpose: "maskable"
                        },
                        {
                            src: "./icons/pwa/maskable_icon_x144.png",
                            sizes: "144x144",
                            type: "image/png",
                            purpose: "maskable"
                        },
                        {
                            src: "./icons/pwa/regular_icon_x144.png",
                            sizes: "144x144",
                            type: "image/png",
                            purpose: "any"
                        },
                        {
                            src: "./icons/pwa/maskable_icon_x192.png",
                            sizes: "192x192",
                            type: "image/png",
                            purpose: "maskable"
                        },
                        {
                            src: "./icons/pwa/maskable_icon_x192.png",
                            sizes: "192x192",
                            type: "image/png",
                            purpose: "any"
                        },
                        {
                            src: "./icons/pwa/maskable_icon_x384.png",
                            sizes: "384x384",
                            type: "image/png",
                            purpose: "maskable"
                        },
                        {
                            src: "./icons/pwa/maskable_icon_x512.png",
                            sizes: "512x512",
                            type: "image/png",
                            purpose: "maskable"
                        },
                        {
                            src: "./icons/pwa/regular_icon_x512.png",
                            sizes: "512x512",
                            type: "image/png",
                            purpose: "any"
                        }
                    ],
                }
            })],
        resolve: {
            alias: [{find: '@', replacement: '/src'}],
        },
    });
}
