<template>
  <v-app id="inspire">
    <top-toolbar/>
    <v-content>
      <h1 class="page_title">Prep Tasks</h1>
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
          <h2 class="table_title">List of Tasks</h2>
          <h3 class="table_info">Click on a row to edit <v-icon color=info>info</v-icon></h3>
          <v-card v-if="dataLoaded" id="main_card" elevation-1>
            <v-data-table id="tasks_data_table" :items="tasks" :headers="taskHeaders" hide-actions class="elevation-1">
              <template slot="items" slot-scope="props">
                <tr @click="selectedTask(props.item)">
                  <td class="text-xs-left cap">{{ props.item.title }}</td>
                  <td class="text-xs-left">{{ props.item.directions }}</td>
                </tr>
              </template>
            </v-data-table>
            <v-dialog v-model="dialog" persistent max-width="600px">
              <v-card id>
                <v-card-title>
                  <span class="headline">Edit Task</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm6 md4>
                        <v-text-field label="Task" :value='reqTitle' v-model='reqTitle'></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-textarea label="Directions" :value='reqDirections' v-model='reqDirections'></v-textarea>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
                  <v-btn color="blue darken-1" flat @click="editTask" :loading="loading" :disabled="loading">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="addNew" persistent max-width="600px">
              <v-card id>
                <v-card-title>
                  <span class="headline">Add Task</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm6 md4>
                        <v-text-field label="Task" v-model='newTitle' ></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-textarea label="Directions" v-model='newDirections'></v-textarea>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click="addNew = false">Close</v-btn>
                  <v-btn color="blue darken-1" flat @click="addTask" :loading="loading" :disabled="loading">Add</v-btn>
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
      reqTitle: '',
      reqDirections: '',
      newTitle: '',
      newDirections: '',
      chosenTaskId: '',
      loading: false,
      taskHeaders: [
        {
          text: 'Task',
          align: 'left',
          value: 'taskName',
          sortable: true
        },
        {
          text: 'Directions',
          align: 'left',
          value: 'directions',
          sortable: false
        }
      ],
      tasks: [],
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
      this.getTasks()
    },
    getTasks () {
      db.collection('tasks').get()
        .then(docs => {
          docs.forEach(doc => {
            let temp = doc.data()
            temp['id'] = doc.id
            this.tasks.push(temp)
            this.dataLoaded = true
          })
        })
        .catch(err => console.error(err))
    },
    goBack () {
      this.$router.push('/')
    },
    selectedTask (task) {
      this.dialog = true
      this.reqTitle = task.title
      this.reqDirections = task.directions
      this.chosenTaskId = task.id
    },
    addTask () {
      this.loading = true
      db.collection('tasks').add(
        {
          title: this.newTitle,
          directions: this.newDirections
        })
        .then(() => {
          this.tasks.push(
            {
              title: this.newTitle,
              directions: this.newDirections
            }
          )
          this.addNew = false
          this.loading = false
          this.newTitle = ''
          this.newDirections = ''
        })
        .catch(err => console.log(err))
    },
    editTask () {
      db.collection('tasks').doc(this.chosenTaskId).update({
        title: this.reqTitle,
        directions: this.reqDirections
      }).catch(error => console.log(error))
      this.reqTitle = ''
      this.reqDirections = ''
      this.tasks = []
      this.getTasks()
      this.loading = false
      this.dialog = false
    }
  }
}
</script>
