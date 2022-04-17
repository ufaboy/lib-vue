import { createRouter, createWebHistory, RouteRecordRaw, RouterOptions  } from 'vue-router'
import {getAdAccess} from "../utils/userData";

import {authMiddleware} from "../middleware/auth";
// import {rolesMiddleware} from "@/middleware/roles";

import VListCategories from '../views/VListCategories.vue'
import LayoutMain from "../layouts/LayoutMain.vue";
import LayoutTest from "../layouts/LayoutTest.vue";
import VTestPage from "../views/VTestPage.vue";
const VListBook = () => import('../views/list/VListBook.vue')
const VListGenre = () => import('../views/list/VListGenre.vue')
const VBookView = () => import('../views/book/VBookView.vue')
const VBookTable = () => import('../views/table/VBookTable.vue')
const VGenreTable = () => import('../views/table/VGenreTable.vue')
const VAuthorTable = () => import('../views/table/VAuthorTable.vue')
const VBookEdit = () => import('../views/book/VBookEdit.vue')
const VMedia = () => import('../views/VMedia.vue')
const VNote = () => import('../views/VNote.vue')
const VError = () => import('../views/VError.vue')


const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: LayoutMain,
    children: [
      {
        path: '',
        name: 'list-categories',
        component: VListCategories,
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
        path: '/genre',
        name: 'genre-index',
        component: VGenreTable
      },
      {
        path: '/books',
        name: 'book-index',
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
        path: '/authors',
        name: 'author-index',
        component: VAuthorTable
      },
      {
        path: '/media',
        name: 'media',
        component: VMedia
      },
      {
        path: '/test',
        name: 'test',
        component: VTestPage
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
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/VLogin.vue'),
  },
  {
    path: '/test',
    name: 'test',
    component: LayoutTest,
    children: [
      {
        path: '',
        component: () => import('../views/VTestPage.vue')
      }
    ]
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
