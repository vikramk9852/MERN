// import app from 'firebase/app';
// import 'firebase/auth';
const app = require('firebase/app');
require('firebase/auth');
var config = {
    apiKey: "AIzaSyDwsh_Sq1unnZF-HnwypOOUKS_8yWrvHX8",
    authDomain: "blog-9fe50.firebaseapp.com",
    databaseURL: "https://blog-9fe50.firebaseio.com",
    projectId: "blog-9fe50",
    storageBucket: "blog-9fe50.appspot.com",
    messagingSenderId: "225707823043",
    appId: "1:225707823043:web:c9a4e65286b014b8553776"
  };

class Firebase {
    constructor() {
        app.initializeApp(config);
        this.auth = app.auth();
    }
    // *** Auth API ***
    doCreateUserWithEmailAndPassword = (email, password) => {
        return this.auth.createUserWithEmailAndPassword(email, password);
    }
    doSignInWithEmailAndPassword = (email, password) =>{
        return this.auth.signInWithEmailAndPassword(email, password);
    }
    doSignOut = () => {
        return this.auth.signOut();
    }
    doPasswordReset = email => {
        return this.auth.sendPasswordResetEmail(email);
    }
    doPasswordUpdate = password =>{
        return this.auth.currentUser.updatePassword(password);
    }
}

export default Firebase;