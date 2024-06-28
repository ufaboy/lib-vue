import { createRouter, createWebHistory, RouteRecordRaw, RouterOptions } from 'vue-router';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: () => import('./layouts/LayoutMain.vue'),
		children: [
			{
				path: '',
				redirect: { name: 'books' },
			},
			{
				path: '/tags',
				name: 'tags',
				component: () => import('./views/TagTable.vue'),
			},
			{
				path: '/books',
				name: 'books',
				component: () => import('./views/books/BooksMain.vue'),
			},
			{
				path: '/book/:id',
				name: 'book-view',
				component: () => import('./views/BookText.vue'),
			},
			{
				path: '/comics/:id',
				name: 'comics-view',
				component: () => import('./views/BookComics.vue'),
			},
			{
				path: '/book/create',
				name: 'book-create',
				component: () => import('./views/BookEdit.vue'),
			},
			{
				path: '/book/update/:id',
				name: 'book-update',
				component: () => import('./views/BookEdit.vue'),
			},
			{
				path: '/authors',
				name: 'authors',
				component: () => import('./views/AuthorTable.vue'),
			},
			{
				path: '/series',
				name: 'series',
				component: () => import('./views/SeriesTable.vue'),
			},
			{
				path: '/media',
				name: 'media',
				component: () => import('./views/MediaGallery.vue'),
			},
		],
	},
	{
		path: '/login',
		component: () => import('./layouts/LayoutAuth.vue'),
		children: [
			{
				path: '',
				name: 'login',
				component: () => import('./views/LoginPage.vue'),
			},
		],
	},
	{
		path: '/test',
		name: 'test',
		component: () => import('./views/TestPage.vue'),
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'error',
		component: () => import('./views/ErrorPage.vue'),
	},

	// {
	//   path: '/about',
	//   name: 'About',
	//   // route level code-splitting
	//   // this generates a separate chunk (about.[hash].js) for this route
	//   // which is lazy-loaded when the route is visited.
	//   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
	// }
];

const router = createRouter({
	history: createWebHistory(),
	routes,
	// @ts-expect-error
	scrollBehavior(to, from, savedPosition): RouterOptions {
		if (savedPosition) {
			// @ts-expect-error
			return savedPosition;
		} else {
			// @ts-expect-error
			return { end: false, history: undefined, routes: [], sensitive: false, strict: false, x: 0, y: 0 };
		}
	},
});

router.beforeEach(async (to, from) => {
	const token = sessionStorage.getItem('lib-token') ?? false;
	const routeName = to.name ? to.name.toString() : 'false';
	const routeWithoutToken = ['login', 'error'];
	if (!routeWithoutToken.includes(routeName) && !token) {
		return { name: 'login' };
	}
});

router.onError(() => {
	router.replace('/error');
});

export { router, routes };
