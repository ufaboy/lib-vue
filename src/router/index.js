// import { defineAsyncComponent } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
const Home = () => import('@/views/Home.vue')
const ListBook = () => import('@/views/ListBook.vue')
const ListGenre = () => import('@/views/ListGenre.vue')
const BookView = () => import('@/views/book/TheView.vue')
const BookTable = () => import('@/views/book/TheTable.vue')
const GenreTable = () => import('@/views/GenreTable.vue')
const BookEdit = () => import('@/views/book/TheEdit.vue')
const BookMedia = () => import('@/views/book/TheMedia.vue')
const TheSettings = () => import('@/views/TheSettings.vue')
const TheNote = () => import('@/views/TheNote.vue')


const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: {
      layout: 'layout-auth'
    }
  },
  {
    path: '/list-book/:id',
    name: 'list-book',
    component: ListBook
  },
  {
    path: '/list-genre/:id',
    name: 'list-genre',
    component: ListGenre
  },
  {
    path: '/genre',
    name: 'genre',
    component: GenreTable
  },
  {
    path: '/book',
    name: 'book',
    component: BookTable
  },
  {
    path: '/book/:id',
    name: 'book-view',
    component: BookView
  },
  {
    path: '/book/:id',
    name: 'book-media',
    component: BookMedia
  },
  {
    path: '/book/create',
    name: 'book-create',
    component: BookEdit
  },
  {
    path: '/book/update/:id',
    name: 'book-edit',
    component: BookEdit
  },
  {
    path: '/settings',
    name: 'settings',
    component: TheSettings
  },
  {
    path: '/note',
    name: 'note',
    component: TheNote
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/TestPage.vue'),
    meta: {
      layout: 'layout-test'
    }
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('lib-token') ?? ''
  if (to.name !== 'login' && !token) next({ name: 'login' })
  else next()
})

export default router
