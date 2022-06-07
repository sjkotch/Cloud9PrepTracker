import firebase from 'firebase'
import 'firebase/firestore'

// firebase init goes here
const config = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: ''
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
