import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    props: true
  },
  {
    path: '/my-article/:type?',
    name: 'my-article',
    component: () => import('@/views/user-article'),
    props: true
  },
  {
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile')
  },
  {
    path: '/user/:userId',
    name: 'user',
    component: () => import('@/views/user')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search')
  },
  {
    path: '/',
    component: () => import('@/views/tabBar'),
    children: [{
      path: '',
      name: 'home',
      component: () => import('@/views/home')
    },
    {
      path: 'qa',
      name: 'qa',
      component: () => import('@/views/qa')
    },
    {
      path: 'video',
      name: 'video',
      component: () => import('@/views/video')
    },
    {
      path: 'my',
      name: 'my',
      component: () => import('@/views/my')
    }]
  }
]
const router = new VueRouter({
  routes
})

export default router
