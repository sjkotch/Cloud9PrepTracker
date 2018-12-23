<template>
  <v-app id="inspire">
    <top-toolbar/>
    <v-content>
      <h1 class="page_title">Employees</h1>
      <v-btn @click="goBack" class="back_btn">Back</v-btn>
      <v-flex id="main_flex">
        <v-progress-circular
          id="loading_animation"
          v-if="!dataLoaded"
          color="primary"
          size="60"
          :width=8
          indeterminate
        ></v-progress-circular>
        <v-flex v-if="dataLoaded">
          <v-card id="main_card" elevation-1>
            <p>add user</p>
          </v-card>
          <v-card v-if="dataLoaded" id="main_card" elevation-1>
            <v-data-table id="chefs_data_table" :items="chefs" :headers="employeeHeaders" hide-actions class="elevation-1">
              <template slot="items" slot-scope="props">
                <tr @click="selectedEmployee(props.item)">
                  <td class="text-xs-left cap">{{ props.item.name }}</td>
                  <td class="text-xs-left cap">{{ props.item.nickname }}</td>
                  <td class="text-xs-left">{{ props.item.email }}</td>
                  <td class="text-xs-left cap">{{ props.item.user_type }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-card>
        </v-flex>
      </v-flex>
    </v-content>
  </v-app>
</template>

<style scoped>
#main_card{
  margin-left: 4em;
  margin-right: 4em;
}
.cap{
  text-transform: capitalize;
}
#main_flex{
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
</style>

<script>
import { db } from '../../firebase.js'

export default {
  data () {
    return {
      employeeHeaders: [
        {
          text: 'Name',
          align: 'left',
          value: 'name',
          sortable: true
        },
        {
          text: 'Nickname',
          align: 'left',
          value: 'nickname',
          sortable: true
        },
        {
          text: 'Email',
          align: 'left',
          value: 'email',
          sortable: false
        },
        {
          text: 'User Type',
          align: 'left',
          value: 'user_type',
          sortable: true
        }
      ],
      chefs: [],
      dataLoaded: false
    }
  },
  computed: {
    // getFullName (user) {
    //   return (user.first_name + ' ' + user.last_name)
    // }
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
            temp['name'] = temp.first_name + ' ' + temp.last_name
            this.chefs.push(temp)
            this.dataLoaded = true
          })
        })
        .catch(err => console.error(err))
    },
    goBack () {
      this.$router.push('/')
    },
    selectedEmployee (user) {
      // console.log(id)
    }
  }
}
</script>
