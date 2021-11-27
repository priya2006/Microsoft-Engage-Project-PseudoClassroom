import axios from 'axios';
import React,{useState} from 'react'
import "../Css/ProfileOptions.css"

/*
This Component is used to change is user wishes to do that 
Rendered from Student/Teacher's Dashboard.js
*/

function Settings(props) {

    /*
    Check is Password is updated.
    */
    const [isupdated,setisupdated]=useState("");

    /*
    if user has entered the password and clicked the change button to change the password.
    */
    function ChangePassword(e){
        e.preventDefault();
        const userEmail=props.email;
        const pass_old=document.getElementById('pass-old').value;
        const pass_new=document.getElementById('pass-new').value;
        const pass_confirm=document.getElementById('pass-confirm').value;

        //If old password entered and is correct.
        if(pass_old===props.user.password){

            //Now check the new password with confirm password whether they match or not and proceed only if they match.
            if(pass_new===pass_confirm){
                axios.patch("/"+props.type+"/"+userEmail,{"password":pass_confirm})
                .then((res)=>{
                    console.log("Password updated successfully!!");
                })
                .catch((err)=>console.log(err));
            
                setisupdated("Password updated successfully!!");
            }else{
                setisupdated("Password do not match. Try again!!")
            }
        }else{
            setisupdated("Old password did not match. Please try again!!");
        }
        document.getElementById('pass-new').value="";
        document.getElementById('pass-confirm').value="";
        document.getElementById('pass-old').value="";

        setTimeout(() => {
            setisupdated("");
        }, 2000);
    }

    return (
        <div className="Settings-cnt scrollbar-hidden">
             <div className="setting-heading">
                <div className="back-button" onClick={()=>{props.setIsSettingsbyProp()}}><i class="fas fa-arrow-circle-left fa-2x"></i></div>
                <div  className="heading">Account Settings</div>
                <hr />
                <div className="change-pass-cont">
                {/* Simple form to enter old, new and confirm the new password */}
                <form  onSubmit={ChangePassword}>
                    <fieldset>
                    <legend className="head">Change your password</legend><br />
                    <div className="oldPAss">old Password:<br /><input type="password" name="old"  id="pass-old" placeholder="Type here.."/></div>
                    <div className="newPAss">New Password:<br /><input type="password" name="new"  id="pass-new" placeholder="Type here.."/></div>
                    <div className="confirmPAss">Confirm Password:<br /><input type="password" name="confirm"  id='pass-confirm' placeholder="Type here.."/></div>
                    <div Style="font-size:1.1rem;color:red;text-align:center;">{isupdated}</div>
                    <div><input type="submit" name="change"  value="Change" className="change"/></div>
                    </fieldset>
                </form>
                </div>
            </div>    
        </div>
    )
}

export default Settings
