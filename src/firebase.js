import firebase from 'firebase'
import 'firebase/firestore'

// firebase init goes here
const config = {
  apiKey: 'AIzaSyAvljnOACm6IyvQObimAhFfmTXi3PPgSo8',
  authDomain: 'prep-tracker-b0bd2.firebaseapp.com',
  databaseURL: 'https://prep-tracker-b0bd2.firebaseio.com',
  projectId: 'prep-tracker-b0bd2',
  storageBucket: 'prep-tracker-b0bd2.appspot.com',
  messagingSenderId: '478618722755'
}
firebase.initializeApp(config)

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser

// date issue fix according to firebase
const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)

// firebase collections
const employeeCol = db.collection('employees')
const eventsCol = db.collection('events')
const tasksCol = db.collection('tasks')
const eventTasksCol = db.collection('event-tasks')

export {
  db,
  auth,
  currentUser,
  employeeCol,
  eventsCol,
  tasksCol,
  eventTasksCol
}
