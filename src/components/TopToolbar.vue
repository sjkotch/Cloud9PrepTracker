<template>
  <v-toolbar app>
    <v-toolbar-title class="headline text-uppercase">
      <span>Cloud 9 Caterers</span>
      <span class="font-weight-light">Prep Cooking Tracker</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
      <v-icon v-if="this.router != '/'" @click="logout" style="color: #2274A5" large dark>exit_to_app</v-icon>
    <!-- <span>Logout</span> -->
  </v-toolbar>
</template>

<script>
import { auth } from 'firebase'

export default {
  data () {
    return {
    }
  },
  methods: {
    goback () {
      this.$router.push('/dashboard')
    },
    logout () {
      auth().signOut().then(() => {
        this.$store.replaceState({})
        window.localStorage.clear()
        this.$router.push('/')
      })
    }
  }
}
</script>
