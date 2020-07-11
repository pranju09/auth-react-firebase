import app from "firebase/app";
import "firebase/auth";
import "firebase/firebase-firestore";
import "firebase/storage";

// var firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_DB_CRM,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_SENDER_ID,
//   appId: process.env.REACT_APP_ID,
//   measurementId: process.env.REACT_APP_MEASUREMENT_ID
// };

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    app.firestore().enablePersistence();
    this.auth = app.auth();
    this.db = app.firestore();
    this.storage = app.storage();
  }
  login(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }
  logout() {
    return this.auth.signOut();
  }
  async register(
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    age,
    city,
    profile_picture
  ) {
    await this.auth.createUserWithEmailAndPassword(email, password);
    return this.db
      .collection("users")
      .doc(this.auth.currentUser.uid)
      .set({
        id: this.auth.currentUser.uid,
        firstName,
        lastName,
        email,
        phoneNumber,
        age,
        city,
        profile_picture
      });
  }
  async update(
    email,
    firstName,
    lastName,
    phoneNumber,
    age,
    city,
    profile_picture
  ) {
    var db = await this.db.doc(`users/${this.auth.currentUser.uid}`);
    return db.set({
      email,
      firstName,
      lastName,
      phoneNumber,
      age,
      city,
      profile_picture: profile_picture || ""
    });
  }
  onAuthComplete() {
    if (!this.auth.currentUser) {
      alert("Not Authorized");
    }
    return true;
  }
  isInitialized() {
    return new Promise(resolve => {
      this.auth.onAuthStateChanged(resolve);
    });
  }
  async getUserData() {
    var db = await this.db.doc(`users/${this.auth.currentUser.uid}`);
    return db.get();
  }
  checkUserLoggedIn() {
    return this.auth.currentUser && this.auth.currentUser.uid;
  }
}

export default new Firebase();
