import React from 'react'
import Login from "./Login";

  //If user entered as teacher then show the login page for type of user as Teacher.

function Teacher(props) {
    return (
     <Login TypeUser="Teacher" />
    )
}

export default Teacher
