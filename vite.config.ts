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
                includeAssets: ['robots.txt'],
                // registerType: 'autoUpdate',
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
                            src: "icon-192.png",
                            sizes: "192x192",
                            type: "image/png",
                            purpose: "maskable"
                        },
                        {
                            src: "/icon-512.png",
                            sizes: "512x512",
                            type: "image/png",
                            purpose: "maskable"
                        },

                    ],
                }
            })],
        resolve: {
            alias: [{find: '@', replacement: '/src'}],
        },
    });
}
