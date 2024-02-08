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
			workbox: {
				navigateFallbackDenylist: [/^\/api/]
			  },
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
						name: 'Tag List',
						short_name: 'Tags',
						description: 'Open Tags List',
						url: '/tags',
						icons: [{ src: 'icons/tags.svg', sizes: '96x96' }],
					},
					{
						name: 'Author List',
						short_name: 'Authors',
						description: 'Open Authors List',
						url: '/authors',
						icons: [{ src: 'icons/authors.svg', sizes: '96x96' }],
					},
				],
				icons: [
					{
						src: 'icons/icon-192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'icons/icon-192_maskable.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any maskable',
					},
					{
						src: 'icons/icon-512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: 'icons/icon-512_maskable.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable',
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
