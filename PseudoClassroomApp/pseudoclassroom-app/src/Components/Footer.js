import React from "react";
import "../Css/Footer.css";

//Footer of the website shows the creator of the website's details it all has how to reach the creator in caseof any issues.

//Feel free to reach out in case of any query.

function Footer() {
  return (
    <div  className="footer-cont">
      <div className="footer">
      <i class="far fa-copyright"></i>&nbsp; - Priyanshi Gupta&nbsp;<a href="https://www.linkedin.com/in/guptapriyanshi2006/" rel="noreferrer" target="_blank"><i class="fab fa-linkedin" ></i></a>&nbsp;
      <a href="mailto:gupta.priyanshi2006@gmail.com"rel="noreferrer" target="_blank"><i class="fas fa-envelope"></i></a>&nbsp;, Microsoft Engage Mentee 2021
      </div>
    </div>
  );
}

export default Footer;
