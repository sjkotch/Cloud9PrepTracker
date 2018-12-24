<template>
  <v-app id="inspire">
    <top-toolbar/>
    <v-content>
      <h1 class="page_title">Events</h1>
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
          <h2 class="table_title">List of Events</h2>
          <h3 class="table_info">Click on a row to edit <v-icon color=info>info</v-icon></h3>
          <v-card v-if="dataLoaded" id="main_card" elevation-1>
            <v-data-table id="events_data_table" :items="events" :headers="eventHeaders" hide-actions class="elevation-1">
              <template slot="items" slot-scope="props">
                <tr @click="selectedEvent(props.item)">
                  <td class="text-xs-left cap">{{ props.item.title }}</td>
                  <td class="text-xs-left cap">{{ props.item.color }}</td>
                  <td class="text-xs-left">{{ props.item.date }}</td>
                </tr>
              </template>
            </v-data-table>
            <v-dialog v-model="dialog" persistent max-width="600px">
              <v-card id>
                <v-card-title>
                  <span class="headline">Edit Event</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm6 md4>
                        <v-text-field label="Event Name" :value='reqName' v-model="reqName"></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field label="Color" :value='reqColor' v-model="reqColor"></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field label="Date" :value='reqDate' v-model="reqDate"></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
                  <v-btn color="blue darken-1" flat @click="editEvent()" :loading="loading" :disabled="loading">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="addNew" persistent max-width="600px">
              <v-card id>
                <v-card-title>
                  <span class="headline">Add Event</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm6 md4>
                        <v-text-field label="Event Name" v-model='newName' ></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field label="Color" v-model='newColor'></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field label="Date" v-model='newDate'></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click="addNew = false">Close</v-btn>
                  <v-btn color="blue darken-1" flat @click="addEvent" :loading="loading" :disabled="loading">Add</v-btn>
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
      reqName: '',
      reqColor: '',
      reqDate: '',
      newName: '',
      newColor: '',
      newDate: '',
      chosenEventId: '',
      loading: false,
      eventHeaders: [
        {
          text: 'Event Name',
          align: 'left',
          value: 'eventName',
          sortable: true
        },
        {
          text: 'Color',
          align: 'left',
          value: 'color',
          sortable: true
        },
        {
          text: 'Date of Event',
          align: 'left',
          value: 'date',
          sortable: false
        }
      ],
      events: [],
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
      this.getEvents()
    },
    getEvents () {
      db.collection('events').get()
        .then(docs => {
          docs.forEach(doc => {
            let temp = doc.data()
            temp['id'] = doc.id
            this.events.push(temp)
            this.dataLoaded = true
          })
        })
        .catch(err => console.error(err))
    },
    goBack () {
      this.$router.push('/')
    },
    selectedEvent (event) {
      this.dialog = true
      this.reqName = event.title
      this.reqColor = event.color
      this.reqDate = event.date
      this.chosenEventId = event.id
    },
    addEvent () {
      this.loading = true
      db.collection('events').add(
        {
          title: this.newName,
          date: this.newDate,
          color: this.newColor
        })
        .then(() => {
          this.events.push(
            {
              title: this.newName,
              date: this.newDate,
              color: this.newColor
            }
          )
          this.addNew = false
          this.loading = false
          this.newName = ''
          this.newDate = ''
          this.newColor = ''
        })
        .catch(err => console.log(err))
    },
    editEvent () {
      db.collection('events').doc(this.chosenEventId).update({title: this.reqName}).catch(error => console.log(error))
      db.collection('events').doc(this.chosenEventId).update({date: this.reqDate}).catch(error => console.log(error))
      db.collection('events').doc(this.chosenEventId).update({color: this.reqColor}).catch(error => console.log(error))
      this.reqName = ''
      this.reqDate = ''
      this.reqColor = ''
      this.events = []
      this.getEvents()
      this.loading = false
      this.dialog = false
    }
  }
}
</script>
