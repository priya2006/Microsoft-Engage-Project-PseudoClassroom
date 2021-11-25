import axios from 'axios';
import React,{useState} from 'react'
import "../Css/ProfileOptions.css"

function Settings(props) {
    const [isupdated,setisupdated]=useState("");

    function ChangePassword(e){
        e.preventDefault();
        const userEmail=props.email;
        const pass_old=document.getElementById('pass-old').value;
        const pass_new=document.getElementById('pass-new').value;
        const pass_confirm=document.getElementById('pass-confirm').value;
        if(pass_old===props.user.password){
            if(pass_new===pass_confirm){
                axios.patch("http://localhost:4000/"+props.type+"/"+userEmail,{"password":pass_confirm})
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
        <div className="Settings-cnt">
             <div className="setting-heading">
                <div className="back-button" onClick={()=>{props.setIsSettingsbyProp()}}><i class="fas fa-arrow-circle-left fa-2x"></i></div>
                <div  className="heading">Account Settings</div>
                <hr />
                <div className="change-pass-cont">
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
