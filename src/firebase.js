import firebase from 'firebase';
// Initialize Firebase
var config = {
   apiKey: "AIzaSyD_HTH3VGlPfuqQPr9rTL7O5zrMNWR6bYs",
   authDomain: "habit-tracker-2cc44.firebaseapp.com",
   databaseURL: "https://habit-tracker-2cc44.firebaseio.com",
   projectId: "habit-tracker-2cc44",
   storageBucket: "",
   messagingSenderId: "358317435075"
};
firebase.initializeApp(config);

export default firebase;