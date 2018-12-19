// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './plugins/vuetify'
import App from './App'
import router from './router'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import './assets/css/main.css'
import store from './store.js'
const fb = require('./firebase.js')

Vue.config.productionTip = false

// handle page reloads
let app
fb.auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      store,
      render: h => h(App)
    })
  }
})
