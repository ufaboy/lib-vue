import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import ListBook from "@/views/ListBook";
import ListGenre from "@/views/ListGenre";
import BookView from "@/views/book/TheView"
import BookTable from "@/views/book/TheTable"
import BookEdit from "@/views/book/TheEdit";
import BookMedia from "@/views/book/TheMedia";
import GenreTable from "@/views/GenreTable";

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
