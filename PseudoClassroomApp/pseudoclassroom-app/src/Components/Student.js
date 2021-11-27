import React from "react";
import Login from "./Login";
function Student(props) {
  
  //If user entered as student then show the login page for type of user as Student.
  return (
    <Login TypeUser="Student"/>
  );
}

export default Student;
