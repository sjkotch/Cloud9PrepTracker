// Vue Imports
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import { auth } from 'firebase'

// Core Component Imports
import Login from '@/components/Login'
import AdminHome from '@/components/AdminHome'
import TopToolbar from '@/components/TopToolbar'

// Plugin Declarations
Vue.use(VueRouter)
Vue.use(Vuex)

// Component Declarations
Vue.component('top-toolbar', TopToolbar)

// Router Implementation
const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/Admin',
      component: AdminHome,
      meta: {
        requiresAuth: true
      }
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

// Router guards
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth().currentUser) {
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (auth().currentUser) {
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
