import React from 'react'
import "../Css/ProfileOptions.css";

//this is the FAQ for the website if someone has issue whihc we have already answered here.

function FAQ(props) {
    return (
        <div className="FAQs-cnt">
             <div className="faq-heading">
                <div className="back-button" onClick={()=>{props.setIsFAQ()}}><i class="fas fa-arrow-circle-left fa-2x"></i></div>
                <div  className="heading">Frequently Asked Questions</div>
                <pre  className="profile-info" Style="font-size:2rem;">
                      Coming Soon..
                </pre>
                <hr />
            </div>    
        </div>
    )
}

export default FAQ
