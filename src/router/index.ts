import { createRouter, createWebHistory, RouteRecordRaw, RouterOptions  } from 'vue-router'
import {getAdAccess} from "../utils/userData";

import {authMiddleware} from "../middleware/auth";
// import {rolesMiddleware} from "@/middleware/roles";

import VHome from '../views/VHome.vue'
import VLogin from '../views/VLogin.vue'

const VListBook = () => import('@/views/list/VListBook.vue')
const VListGenre = () => import('@/views/list/VListGenre.vue')
const VBookView = () => import('@/views/book/VBookView.vue')
const VBookTable = () => import('@/views/table/VBookTable.vue')
const VGenreTable = () => import('@/views/table/VGenreTable.vue')
const VAuthorTable = () => import('@/views/VAuthorTable.vue')
const VBookEdit = () => import('@/views/book/VBookEdit.vue')
const VMedia = () => import('@/views/VMedia.vue')
const VNote = () => import('@/views/VNote.vue')
const VError = () => import('@/views/VError.vue')
const VTestPage = () => import('@/views/VTestPage.vue')


const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: VHome,
  },
  {
    path: '/list-book/:id',
    name: 'list-book',
    component: VListBook,
  },
  {
    path: '/list-genre/:name',
    name: 'list-genre',
    component: VListGenre
  },
  {
    path: '/list-genre/:name',
    name: 'list-genre',
    component: VListGenre
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
    path: '/book/view/:id',
    name: 'book-view',
    component: VBookView
  },
  {
    path: '/book',
    name: 'book-index',
    component: VBookTable
  },
  {
    path: '/genre',
    name: 'genres',
    component: VGenreTable
  },
  {
    path: '/authors',
    name: 'authors',
    component: VAuthorTable
  },
  {
    path: '/media',
    name: 'media',
    component: VMedia
  },
  {
    path: '/note',
    name: 'note',
    component: VNote,
    beforeEnter: (to, from, next) => {
      if (getAdAccess()) {
        next()
      } else {
        next(new Error('dont panic'))
      }
    }
  },
  {
    path: '/login',
    name: 'login',
    component: VLogin,
  },
  {
    path: '/test',
    name: 'test',
    component: VTestPage,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'error',
    component: VError,
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
  // @ts-expect-error
  scrollBehavior(to, from, savedPosition): RouterOptions {
    if (savedPosition) {
      // @ts-expect-error
      return savedPosition
    } else {
      // @ts-expect-error
      return {end: false, history: undefined, routes: [], sensitive: false, strict: false, x: 0, y: 0 }
    }
  }
})

router.beforeEach(async (to, from, next) => {
  await authMiddleware(to, from, next);
})

router.onError(() => {
  router.replace('/error')
})

export { router };
