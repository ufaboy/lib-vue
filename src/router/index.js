import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

import {authMiddleware} from "@/middleware/auth";
// import {rolesMiddleware} from "@/middleware/roles";

import Home from '@/views/Home.vue'
// const Home = () => import('@/views/Home.vue')
const ListBook = () => import('@/views/ListBook.vue')
const ListGenre = () => import('@/views/ListGenre.vue')
const BookView = () => import('@/views/book/TheView.vue')
const BookTable = () => import('@/views/book/TheTable.vue')
const GenreTable = () => import('@/views/GenreTable.vue')
const BookEdit = () => import('@/views/book/TheEdit.vue')
const BookMedia = () => import('@/views/book/TheMedia.vue')
const TheSettings = () => import('@/views/TheSettings.vue')
const TheNote = () => import('@/views/TheNote.vue')
const TheError = () => import('@/views/TheError.vue')


const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/TheLogin.vue'),
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
    component: TheNote,
    beforeEnter: (to, from, next) => {
      const user = store.state.user.username
      if (user === 'admin' ) {
        next()
      } else {
        next(new Error('dont panic'))
      }
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'error',
    component: TheError,
    meta: {
      layout: 'layout-error'
    }
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/TestPage.vue'),
    meta: {
      layout: 'layout-test'
      // auth: true,
      // roles: ["admin"]
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
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach(async (to, from, next) => {
  await authMiddleware(to, from, next);
  // await rolesMiddleware(to, from, next);

  // const token = sessionStorage.getItem('lib-token') ?? ''
  // const routeWithoutToken = ['login', 'error']
  // if (!routeWithoutToken.includes(to.name) && !token) next({ name: 'login' })
  // else next()
})

router.onError(() => {
  router.replace('/error')
})

export default router
