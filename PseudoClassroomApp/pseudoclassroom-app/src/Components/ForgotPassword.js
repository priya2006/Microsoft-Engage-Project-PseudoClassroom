import React,{useState,useEffect} from 'react'
import axios from 'axios'
import "../Css/Home.css"
import "../Css/Login.css"

//This is the page if incase you forget the password then you can change the password using your mail and OTP.

function ForgotPassword() {

    const [IsEmailSent,setIsEmailSent]=useState(false);//to check whether OTP mail has been sent or not
    const [Error,setError]=useState("");//check for error
    const [otp,setotp]=useState(0);//store otp from backend 
    const [user,setuser]=useState(null);//store user details
    const [typeUser,setTypeUser]=useState("");//store type of user like student or teacher
    const [resetPass,setResetPass]=useState(false);//to check whether OTP entered is correct and to reset passowrd or not
    const [isupdated,setisupdated]=useState("");//to check whether the password is updated or not

     async function SendOTP(){
        let type="";
        const email=document.querySelector("input[type='email']").value;//email entered by the user

        //check whether this email exist in DB or not.

        //for student 
        await axios.get("/student/"+email)
        .then(async(res)=>{
            console.log(res);
            if(res.data.length){
                //If present then send the mail to this email of unique 4-digit OTP
                await axios.post("/student/resetPassOTP",{"email":res.data[0].email,"firstName":res.data[0].firstName})
                .then((res)=>{
                    console.log("Open this to see the OTP in console to move forward",res);
                    setotp(res.data);
                    setIsEmailSent(true);
                })
                .catch((err)=>{
                    console.log(err);
                })
                setuser(res.data[0]);
                setTypeUser("student");
            }
        })
        .catch((err)=>{
            console.log(err);
        })

        if(!IsEmailSent){

            //If email is not sent means student is  not there then send to teacher 

                await axios.get("/teacher/"+email)
            .then( async (res)=>{
                if(res.data.length){

                    //Send the OTP now

                     await axios.post("/teacher/resetPassOTP",{"email":email,"firstName":res.data[0].firstName})
                    .then((res)=>{
                        console.log("Open this to see the OTP in console to move forward",res);
                        setotp(res.data)
                        setIsEmailSent(true);
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
                    setuser(res.data[0]);
                    setTypeUser("teacher");
                }
            })
            .catch((err)=>{
                console.log(err);
            })  
        }
        if(!IsEmailSent){
            setError("Email not found")
        }
        setTimeout(() => {
            setError("");
        }, 1000);
        
    }
    //Checking whether OTP from backend matches with what has been entered by user.
    function checkOTPAndResetPass(){
        const currOTP=document.getElementById('currOTP').value;
        if(currOTP===otp){
            setResetPass(true);
        }
    }

    /*
    If everything goes well change the password the user and now the fiedl to user to enter new password and update it successfully.
    */

    function ChangePassword(e){
        e.preventDefault();
        const userEmail=user.email;
        const pass_new=document.getElementById('pass-new').value;
        const pass_confirm=document.getElementById('pass-confirm').value;
            if(pass_new===pass_confirm){
                
                //If new Password entered matches with conform password then only update the Password

                axios.patch("/"+typeUser+"/"+userEmail,{"password":pass_confirm})
                .then((res)=>{
                    console.log("Password updated successfully!!");
                })
                .catch((err)=>console.log(err));
            
                setisupdated("Password updated successfully!! Use Home to re-Login");
            }else{
                setisupdated("Password do not match. Try again!!")
            }
        document.getElementById('pass-new').value="";
        document.getElementById('pass-confirm').value="";
        setTimeout(() => {
            setisupdated("");
        }, 2000);
    }

    return (
        <div>
        <div className="home-cont">
        {
            //If reset password is not true which means otp is not sentand matched yet 
            !resetPass&&
            <>
            <div className="welcome-note">
            <h3>Reset Password!!</h3>
            </div>
            <div className="Login-details" >
                <div className="Email-cont">
                    <i class="fa fa-envelope icon"></i>
                    <input type="email" className="newUserEmail" placeholder="Enter Email" />
                </div>{!IsEmailSent&&<input type="submit" value="Send OTP" className="sendOTP" id="sendOTP" onClick={SendOTP}/>}
                {
                    IsEmailSent?
                    <div className="Pass-cont">
                    <i class="fa fa-key icon"></i>
                    <input type="password" id="currOTP" className="newUserPass"  placeholder="Enter 4-digit OTP sent via mail to above email" />
                    <div><input type="submit" value="Submit"className="checkAndReset-btn" onClick={checkOTPAndResetPass}/></div>
                    </div>:
                    <span>{Error}</span>//Show error if any like Email not match, OTP isn't match 
                }
            </div>
            </>
        }
        {
            //if OTP sent and match now show change password window
         resetPass&&
         <div className="reset-pass-cont">
            <form  onSubmit={ChangePassword}>
                    <div className="welcome-note">
                    <h3>Reset Password!!</h3>
                    </div>
                    <div className="newPAss">New Password:<br /><input type="password" name="new"  id="pass-new" placeholder="Type here.."/></div>
                    <div className="confirmPAss">Confirm Password:<br /><input type="password" name="confirm"  id='pass-confirm' placeholder="Type here.."/></div>
                    <div Style="font-size:1.1rem;color:red;text-align:center;">{isupdated} </div>
                    <div><input type="submit" name="change"  value="Change" className="Reset"/></div>
            </form>
        </div>  
        }
      </div>
        </div>
    )
}

export default ForgotPassword
