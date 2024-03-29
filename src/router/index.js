// Vue Imports
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import { auth } from 'firebase'

// Core Component Imports
import Login from '@/components/CoreComponents/Login'
import TopToolbar from '@/components/CoreComponents/TopToolbar'

// Admin View Imports
import AdminHome from '@/components/AdminViews/AdminHome'
import AdminEmployees from '@/components/AdminViews/AdminEmployees'
import AdminTasks from '@/components/AdminViews/AdminTasks'
import AdminEvents from '@/components/AdminViews/AdminEvents'
import AdminAssignments from '@/components/AdminViews/AdminAssignments'

// Chef View Imports
import ChefHome from '@/components/ChefViews/ChefHome'

// Plugin Declarations
Vue.use(VueRouter)
Vue.use(Vuex)

// Component Declarations
Vue.component('top-toolbar', TopToolbar)

// Router Implementation
const router = new VueRouter({
  mode: 'history',
  routes: [
    // Core Components
    {
      path: '/',
      component: Login
    },
    // Admin Views
    {
      path: '/Admin',
      component: AdminHome,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/Admin/Employees',
      component: AdminEmployees,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/Admin/Tasks',
      component: AdminTasks,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/Admin/Events',
      component: AdminEvents,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/Admin/Assignments',
      component: AdminAssignments,
      meta: {
        requiresAuth: true
      }
    },
    // Chef Views
    {
      path: '/Chef',
      component: ChefHome,
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
