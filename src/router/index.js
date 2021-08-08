import { createRouter, createWebHistory } from 'vue-router'
import {adAccess} from "@/utils/userData";

import {authMiddleware} from "@/middleware/auth";
// import {rolesMiddleware} from "@/middleware/roles";

import Home from '@/views/VHome.vue'
// const Home = () => import('@/views/VHome.vue')
const VListBook = () => import('@/views/VListBook.vue')
const VListGenre = () => import('@/views/VListGenre.vue')
const VBookView = () => import('@/views/book/VBookView.vue')
const VBookTable = () => import('@/views/book/VBookTable.vue')
const VGenreTable = () => import('@/views/VGenreTable.vue')
const VBookEdit = () => import('@/views/book/VBookEdit.vue')
const VSettings = () => import('@/views/VSettings.vue')
const VNote = () => import('@/views/VNote.vue')
const VError = () => import('@/views/VError.vue')


const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/VLogin.vue'),
    meta: {
      layout: 'layout-auth'
    }
  },
  {
    path: '/list-book/:id',
    name: 'list-book',
    component: VListBook
  },
  {
    path: '/list-genre/:name',
    name: 'list-genre',
    component: VListGenre
  },
  {
    path: '/genre',
    name: 'genre',
    component: VGenreTable
  },
  {
    path: '/book',
    name: 'book',
    component: VBookTable
  },
  {
    path: '/book/:id',
    name: 'book-view',
    component: VBookView
  },
  {
    path: '/book/create',
    name: 'book-create',
    component: VBookEdit
  },
  {
    path: '/book/update/:id',
    name: 'book-edit',
    component: VBookEdit
  },
  {
    path: '/settings',
    name: 'settings',
    component: VSettings
  },
  {
    path: '/note',
    name: 'note',
    component: VNote,
    beforeEnter: (to, from, next) => {
      if (adAccess) {
        next()
      } else {
        next(new Error('dont panic'))
      }
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'error',
    component: VError,
    meta: {
      layout: 'layout-error'
    }
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/VTestPage.vue'),
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
})

router.onError(() => {
  router.replace('/error')
})

export default router
