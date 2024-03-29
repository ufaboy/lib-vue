import { createRouter, createWebHistory, RouteRecordRaw, RouterOptions } from 'vue-router';
import { isSmallDevice } from './utils/helper';

const LayoutAuth = () => import('./layouts/LayoutAuth.vue');
const LayoutMain = () => import('./layouts/LayoutMain.vue');
const LayoutSidebar = () => import('./layouts/LayoutSidebar.vue');
const AuthorTable = () => import('./views/AuthorTable.vue');
const BookTable = () => import('./views/BookTable.vue');
const BookList = () => import('./views/BookList.vue');
const BookText = () => import('./views/BookText.vue');
const BookComics = () => import('./views/BookComics.vue');
const BookEdit = () => import('./views/BookEdit.vue');
const MediaGallery = () => import('./views/MediaGallery.vue');
const SeriesTable = () => import('./views/SeriesTable.vue');
const TagTable = () => import('./views/TagTable.vue');
const LoginPage = () => import('./views/LoginPage.vue');
const TestPage = () => import('./views/TestPage.vue');
const ErrorPage = () => import('./views/ErrorPage.vue');

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: isSmallDevice() ? LayoutMain : LayoutSidebar,
		children: [
			{
				path: '',
				redirect: { name: 'books' },
			},
			{
				path: '/tags',
				name: 'tags',
				component: TagTable,
			},
			{
				path: '/books',
				name: 'books',
				component: isSmallDevice() ? BookList : BookTable,
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
				name: 'authors',
				component: AuthorTable,
			},
			{
				path: '/series',
				name: 'series',
				component: SeriesTable,
			},
			{
				path: '/media',
				name: 'media',
				component: MediaGallery
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
