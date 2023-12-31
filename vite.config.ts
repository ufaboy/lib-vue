import path from 'path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
// import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  base: '/',
  // server: {
  //   https: true,
  // },
  plugins: [
    vue(),
    // basicSsl(),
    VitePWA({
      registerType: 'autoUpdate',
      // devOptions: {
      //   enabled: true,
      // },
      manifest: {
        name: 'Library',
        short_name: 'Lib',
        description: 'My Books & Comics Library ',
        scope: '/',
        theme_color: '#1f2937',
        background_color: '#1f2937',
        categories: ['books'],
        shortcuts: [
          {
            name: 'Books List',
            short_name: 'Books',
            description: 'Open Books List',
            url: '/book-list',
            // icons: [{ src: '/images/today.png', sizes: '192x192' }],
          },
          {
            name: 'Author List',
            short_name: 'Author',
            description: 'Open Author List',
            url: '/author-list',
          },
        ],
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  build: {
    // minify: false,
    rollupOptions: {
      output: {
        manualChunks(name: string) {
/*           if (name.includes('Icon')) {
            console.log('manualChunks name', name);
            return 'icon-pack';
          } */
/*           const reg = new RegExp('^Icon[A-Z][a-zA-Z]*');
          if (reg.test(name)) {
            return 'icon-pack';
          } */
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
    },
  },
});
