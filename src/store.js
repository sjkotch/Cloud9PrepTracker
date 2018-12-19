import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: window.localStorage,
  reducer: state => ({
    user: state.user
  })
})

const store = new Vuex.Store({
  state: {},
  mutations: {
    pageChange (state, page) {
      state['currentPage'] = page
    },
    editPhoneNumber (state, number) {
      state.user['phone'] = number
    },
    editEmail (state, email) {
      state.user['email'] = email
    },
    editFirstName (state, firstName) {
      state.user['first_name'] = firstName
    },
    editLastName (state, lastName) {
      state.user['last_name'] = lastName
    },
    setUser (state, user) {
      state['user'] = user
    }
  },
  getters: {
    fullUserInfo: () => {
      return store.state.user
    }
  },
  plugins: [vuexLocalStorage.plugin]
})

export default store
