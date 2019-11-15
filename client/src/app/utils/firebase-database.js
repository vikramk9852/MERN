import firebase from 'firebase';
// const firebase = require('firebase');
const firebaseConfig = {
    apiKey: "AIzaSyAvkH5nI2bKPro4U_Fxs9QmP4vP_hTx57s",
    authDomain: "clipboard-sync-a5c0d.firebaseapp.com",
    databaseURL: "https://clipboard-sync-a5c0d.firebaseio.com",
    projectId: "clipboard-sync-a5c0d",
    storageBucket: "clipboard-sync-a5c0d.appspot.com",
    messagingSenderId: "654965544385",
    appId: "1:654965544385:web:227ba67632eb9349618b40",
    measurementId: "G-FJBQ3XQE0R"
  };
firebase.initializeApp(firebaseConfig);

export default firebase;
// var ref = firebase.app().database().ref();
// ref.once(`value`)
//     .then(snap => {
//         console.log(`snap.val()`, snap.val());
//     }).catch(err => {
//         console.log(err)
//     })