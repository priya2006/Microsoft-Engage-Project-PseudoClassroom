import React from "react";
import {Link} from 'react-router-dom'
import "../Css/Header.css";

//Header of the website to show the title of App

function Header() {
  return (
    <div className="header-cont">
      {/* <Link> */}
      <Link className="heading-home" to="/"><i class="fas fa-home"></i></Link>
        <div className="heading"><i class="far fa-calendar-check fa-lg"></i> Pseudo Classroom <i Style="font-size:1.1rem;">( Scheduler + Classroom )</i   ></div>
    </div>
  );
}

export default Header;
