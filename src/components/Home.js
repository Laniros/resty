import React from "react";
import firebase from "../firebase";

function Home() {
  var database = firebase.database();
  function writeUserData(userId, name, email) {
    firebase
      .database()
      .ref("users/" + userId)
      .set({
        username: name,
        email: email,
      });
  }
  return (
    <div>
      <button onClick={writeUserData("yosi", "man", "lanir@dfa@,com")}>
        Write here!!!
      </button>
    </div>
  );
}

export default Home;
