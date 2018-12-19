<template>
  <v-app id="inspire">
    <top-toolbar/>
    <v-content>
      <v-flex>
            <v-btn @click="sendToEmployees" color="primary">Employee List</v-btn>
            <v-btn @click="sendToTasks" color="primary">Prep Tasks</v-btn>
            <v-btn @click="sendToEvents" color="primary">Events</v-btn>
            <v-btn @click="sendToAssignments" color="primary">Assignments</v-btn>
      </v-flex>
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
    sendToEmployees () {
      this.$router.push('/Admin/Employees')
    },
    sendToTasks () {
      this.$router.push('/Admin/Tasks')
    },
    sendToEvents () {
      this.$router.push('/Admin/Events')
    },
    sendToAssignments () {
      this.$router.push('/Admin/Assignments')
    }
  }
}
</script>
