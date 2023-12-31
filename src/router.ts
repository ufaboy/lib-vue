import { createRouter, createWebHistory, RouteRecordRaw, RouterOptions } from 'vue-router';

const LayoutAuth = () => import('./layouts/LayoutAuth.vue');
const LayoutMain = () => import('./layouts/LayoutMain.vue');
const AuthorTable = () => import('./views/AuthorTable.vue');
const BookTable = () => import('./views/BookTable.vue');
const BookList = () => import('./views/BookList.vue');
const BookText = () => import('./views/BookText.vue');
const BookComics = () => import('./views/BookComics.vue');
const BookEdit = () => import('./views/BookEdit.vue');
const ImageGallery = () => import('./views/ImageGallery.vue');
const ImageTable = () => import('./views/ImageTable.vue');
const SeriesTable = () => import('./views/SeriesTable.vue');
const TagTable = () => import('./views/TagTable.vue');
const LoginPage = () => import('./views/LoginPage.vue');
const TestPage = () => import('./views/TestPage.vue');
const ErrorPage = () => import('./views/ErrorPage.vue');

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: LayoutMain,
		children: [
			{
				path: '',
				redirect: { name: 'book-table' },
			},
			{
				path: '/tags',
				name: 'tag-list',
				component: TagTable,
			},
			{
				path: '/books',
				name: 'book-table',
				component: BookTable,
				beforeEnter: (to, from) => {
					const width = Math.floor(document.documentElement.clientWidth);
					if (width < 1024) return { name: 'book-list' };
				},
			},
			{
				path: '/books-list',
				name: 'book-list',
				component: BookList,
			},
			{
				path: '/book/:id',
				name: 'book-view',
				component: BookText,
			},
			{
				path: '/comics/:id',
				name: 'comics-view',
				component: BookComics,
			},
			{
				path: '/book/create',
				name: 'book-create',
				component: BookEdit,
			},
			{
				path: '/book/update/:id',
				name: 'book-update',
				component: BookEdit,
			},
			{
				path: '/authors',
				name: 'author-list',
				component: AuthorTable,
			},
			{
				path: '/series',
				name: 'series-list',
				component: SeriesTable,
			},
			{
				path: '/images',
				children: [
					{
						path: '',
						name: 'images-table',
						component: ImageTable,
					},
					{
						path: 'gallery',
						name: 'images-gallery',
						component: ImageGallery,
					},
				],
			},
		],
	},
	{
		path: '/login',
		component: LayoutAuth,
		children: [
			{
				path: '',
				name: 'login',
				component: LoginPage,
			},
		],
	},
	{
		path: '/test',
		name: 'test',
		component: TestPage,
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'error',
		component: ErrorPage,
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
	history: createWebHistory('reader'),
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
