<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Login</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <!-- <v-form>
                  <v-text-field prepend-icon="person" name="login" placeholder="Login" type="text"></v-text-field>
                  <v-text-field id="password" prepend-icon="lock" name="password" placeholder="Password" type="password"></v-text-field>
                </v-form> -->
                <v-form @submit.prevent="submit" v-model="valid" ref="form">
                        <v-text-field
                          label="Email"
                          v-model="email"
                          :rules="emailRules"
                          autocomplete="current-email"
                          placeholder=" "
                          :validate-on-blur=true
                          required
                        ></v-text-field>
                        <v-text-field
                          label="Password"
                          v-model="password"
                          min="8"
                          :append-icon="e1 ? 'visibility' : 'visibility_off'"
                          @click:append="() => (e1 = !e1)"
                          :type="e1 ? 'password' : 'text'"
                          :rules="passwordRules"
                          autocomplete="password"
                          placeholder=" "
                          :validate-on-blur=true
                          counter
                          required
                        ></v-text-field>
                        <v-layout class="mt-4 pb-2" justify-space-between>
                          <router-link style="color: var(--v-secondary-base)" class="ml-2 mt-2" to="/recovery">Forgot password?</router-link>
                          <v-btn
                            type="submit"
                            :loading="loading"
                            :disabled="loading"
                            color="primary"
                            @click="submit">LOG IN
                          </v-btn>
                        </v-layout>
                      </v-form>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<style scoped>
#inspire {
  background: url("../assets/images/login_background.jpg") no-repeat;
  background-position: center center;
  background-size: cover;
}
</style>

<script>
import { auth } from 'firebase'
import { db } from '../firebase.js'
import { userType } from '../Middleware/determine_user_type.js'

export default {
  data () {
    return {
      valid: false,
      e1: true,
      loginError: false,
      passwordRules: [
        (v) => !!v || 'Password is required'
      ],
      emailRules: [
        (v) => !!v || 'E-mail is required',
        // eslint-disable-next-line
        (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      login: true,
      email: '',
      password: '',
      loading: false
    }
  },
  created () {
    this.init()
  },
  mounted () {
    let isUser = auth().currentUser
    if (isUser) {
      this.$router.push('/' + userType(this.$store.state.user.user_type))
    }
  },
  methods: {
    init () {
    },
    submit (e) {
      this.loading = true
      auth().signInWithEmailAndPassword(this.email, this.password)
        .then(user => {
          let userRef = db.collection('employees').doc(user.user.uid)
          this.$store.state['user_ref'] = userRef
          // eslint-disable-next-line
          let getDoc = this.$store.state.user_ref.get()
            .then(doc => {
              let userObj = doc.data()
              userObj['uid'] = doc.id
              this.$store.commit('setUser', userObj)
              this.loading = false
              console.log(userType(userObj.user_type))
              this.$router.push('/' + userType(userObj.user_type))
              // this.$router.push('/Admin')
            })
            // eslint-disable-next-line
            .catch(err => this.loading = false)
        })
        // eslint-disable-next-line
        .catch(err => {
          this.loginError = true
          this.loading = false
        })
      e.preventDefault()
    },
    clear () {
      this.$refs.form.reset()
    }
  }
}
</script>
