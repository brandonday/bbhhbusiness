import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyB7cG8PE9KgB153DQUOl5aQIawxrTz9mLE",
    authDomain: "bbhh-444ba.firebaseapp.com",
    databaseURL: "https://bbhh-444ba.firebaseio.com",
    projectId: "bbhh-444ba",
    storageBucket: "bbhh-444ba.appspot.com",
    messagingSenderId: "708612637967",
    appId: "1:708612637967:web:3835f1c33d21e90466ea7a",
    measurementId: "G-4TPM40JDBG"
};
class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.auth = app.auth();
    this.db = app.database();
    this.storage = app.storage().ref();

  }
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);
  
  user = uid => this.db.ref(`users/${uid}`);
  users = () => this.db.ref('users');
  database = () => this.db;
  storage = () => this.storage;
  auth = () => this.auth;
}
export default Firebase;