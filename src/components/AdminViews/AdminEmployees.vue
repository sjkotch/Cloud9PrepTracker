<template>
  <v-app id="inspire">
    <top-toolbar/>
    <v-content>
      <h1 class="page_title">Employees</h1>
      <v-btn @click="goBack" class="back_btn">Back</v-btn>
      <v-flex>
        <v-progress-circular
          id="loading_animation"
          v-if="!dataLoaded"
          color="primary"
          size="60"
          :width=8
          indeterminate
        ></v-progress-circular>
        <v-card v-if="dataLoaded">
          <p>done</p>
          <v-data-table id="chefs_data_table" :items="chefs" hide-headers hide-actions class="elevation-1">
            <template slot="chefs" slot-scope="props">
              <tr>
                <td class="text-xs-left">{{ props.item.first_name + " " + props.item.last_name }}</td>
                <td class="text-xs-left">{{ props.item.email }}</td>
                <td class="text-xs-left">{{ props.item.phone }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-content>
  </v-app>
</template>

<script>
import { db } from '../../firebase.js'

export default {
  data () {
    return {
      chefs: [],
      dataLoaded: false
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.getEmployees()
    },
    getEmployees () {
      db.collection('employees').get()
        .then(docs => {
          docs.forEach(doc => {
            let temp = doc.data()
            temp['id'] = doc.id
            this.chefs.push(temp)
            this.dataLoaded = true
            console.log(this.chefs)
          })
        })
        .catch(err => console.error(err))
    },
    goBack () {
      this.$router.push('/')
    }
  }
}
</script>
