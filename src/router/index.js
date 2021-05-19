import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import ListBook from "@/views/ListBook";
import ListGenre from "@/views/ListGenre";

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
