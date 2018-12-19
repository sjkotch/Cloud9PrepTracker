<template>
  <v-app id="inspire">
    <top-toolbar/>
    <v-content>
      <v-btn @click="goBack" color="primary">Back</v-btn>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    goBack () {
      this.$router.push('/')
    }
  }
}
</script>
