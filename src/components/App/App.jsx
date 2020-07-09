import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Login from "../Login/Login";
import Register from "../Register/Register";
import firebase from "../../utils/firebase";
import Profile from "../Profile/Profile";

export default function App() {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  useEffect(() => {
    firebase
      .isInitialized()
      .then(val => {
        setFirebaseInitialized(val);
      })
      .catch(() => {});
  });

  return firebaseInitialized !== false ? (
    <Router>
      <Route path="/"></Route>
      <Route path="/login" component={Login}></Route>
      <Route path="/register" component={Register}></Route>
      <Route path="/profile" component={Profile}></Route>
      {firebase.checkUserLoggedIn() ? (
        <Redirect to="/profile"></Redirect>
      ) : (
        <Redirect to="/login"></Redirect>
      )}
    </Router>
  ) : (
    <h2>Loading Firebase........</h2>
  );
}
