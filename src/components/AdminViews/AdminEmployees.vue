<template>
  <v-app id="inspire">
    <top-toolbar/>
    <v-content>
      <h1 class="page_title">Employees</h1>
      <v-btn @click="goBack" class="back_btn" color=primary><v-icon>arrow_back</v-icon> &nbsp; Back</v-btn>
      <v-btn @click="addNew = true" class="add_btn" color=accent>Add New</v-btn>
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
          <h2 class="table_title">List of Employees</h2>
          <h3 class="table_info">Click on a row to edit <v-icon color=info>info</v-icon></h3>
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
            <v-dialog v-model="dialog" persistent max-width="600px">
              <v-card id>
                <v-card-title>
                  <span class="headline">Edit Employee</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm6 md4>
                        <v-text-field label="First name" :value='reqFirstName' v-model='reqFirstName' ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field label="Last name" :value='reqLastName' v-model='reqLastName'></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field label="Nickname" :value='reqNickname' v-model='reqNickname'></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field label="Email" :value='reqEmail' v-model='reqEmail'></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-select :items="['admin', 'chef']" label="User Type" v-model='reqUserType'></v-select>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
                  <v-btn color="blue darken-1" flat @click="editEmployee" :loading="loading" :disabled="loading">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="addNew" persistent max-width="600px">
              <v-card id>
                <v-card-title>
                  <span class="headline">Add Employee</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm6 md4>
                        <v-text-field label="First name" v-model='newFirstName' ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field label="Last name" v-model='newLastName'></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field label="Nickname" v-model='newNickname'></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field label="Email" v-model='newEmail'></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-select :items="['admin', 'chef']" label="User Type" v-model='newUserType'></v-select>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click="addNew = false">Close</v-btn>
                  <v-btn color="blue darken-1" flat @click="addEmployee" :loading="loading" :disabled="loading">Add</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
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
      reqFirstName: '',
      reqLastName: '',
      reqNickname: '',
      reqEmail: '',
      reqUserType: '',
      newFirstName: '',
      newLastName: '',
      newNickname: '',
      newEmail: '',
      newUserType: '',
      chosenEmployeeId: '',
      loading: false,
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
      dialog: false,
      addNew: false,
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
      this.dialog = true
      this.reqFirstName = user.first_name
      this.reqLastName = user.last_name
      this.reqNickname = user.nickname
      this.reqEmail = user.email
      this.reqUserType = user.user_type
      this.chosenEmployeeId = user.id
    },
    addEmployee () {
      this.loading = true
      db.collection('employees').add(
        {
          first_name: this.newFirstName,
          last_name: this.newLastName,
          nickname: this.newNickname,
          email: this.newEmail,
          user_type: this.newUserType
        })
        .then(() => {
          this.chefs.push(
            {
              first_name: this.newFirstName,
              last_name: this.newLastName,
              nickname: this.newNickname,
              email: this.newEmail,
              user_type: this.newUserType,
              name: this.newFirstName + ' ' + this.newLastName
            }
          )
          this.addNew = false
          this.loading = false
          this.first_name = ''
          this.last_name = ''
          this.nickname = ''
          this.email = ''
          this.user_type = ''
        })
        .catch(err => console.log(err))
    },
    editEmployee () {
      db.collection('employees').doc(this.chosenEmployeeId).update({
        first_name: this.reqFirstName,
        last_name: this.reqLastName,
        nickname: this.reqNickname,
        email: this.reqEmail,
        user_type: this.reqUserType
      }).catch(error => console.log(error))
      this.first_name = ''
      this.last_name = ''
      this.nickname = ''
      this.email = ''
      this.user_type = ''
      this.chefs = []
      this.getEmployees()
      this.loading = false
      this.dialog = false
    }
  }
}
</script>
