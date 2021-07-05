import firebase from 'firebase/app'
import 'firebase/firebase-messaging'
var firebaseConfig = {
  apiKey: "AIzaSyDY-gNiJ0EoSKEAGEdu-alekSF4vLRI43Q",
  authDomain: "mumbi-app-84d15.firebaseapp.com",
  projectId: "mumbi-app-84d15",
  storageBucket: "mumbi-app-84d15.appspot.com",
  messagingSenderId: "976794787434",
  appId: "1:976794787434:web:727b6a4ec15bb0a23e3413"
}

firebase.initializeApp(firebaseConfig)

export default firebase.messaging()