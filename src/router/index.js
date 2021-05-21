import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import ListBook from "@/views/ListBook";
import ListGenre from "@/views/ListGenre";
import BookView from  "@/views/BookView"
import BookTable from  "@/views/BookTable"
import BookEdit from "@/views/BookEdit";
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
    path: '/book/create',
    name: 'book-create',
    component: BookEdit
  },
  {
    path: '/book/update/:id',
    name: 'book-edit',
    component: BookEdit
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

export default router
