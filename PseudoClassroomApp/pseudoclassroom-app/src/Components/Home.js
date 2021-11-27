import React from "react";
import { Link } from "react-router-dom";
import "../Css/Home.css";

//Home page of website so that user can select how to enter into the app like as a studentor as a teacher.

function Home() {
  return (
    <div>
     
      <div className="home-cont">
        <div className="welcome-note">
          <h3>Welcome to Class Scheduler!!</h3>
        </div>
        <div className="options">
          <Link to="/student" className="student-btn"><span>As a Student</span></Link>
          <Link to="/teacher"className="teacher-btn"><span>As a Teacher</span></Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
