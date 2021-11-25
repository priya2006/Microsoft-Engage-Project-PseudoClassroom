import React,{useState,useEffect} from 'react'
import axios from 'axios'
import "../Css/Home.css"
import "../Css/Login.css"

function ForgotPassword() {

    const [IsEmailSent,setIsEmailSent]=useState(false);
    const [Error,setError]=useState("");
    const [otp,setotp]=useState(0);
    const [user,setuser]=useState(null);
    const [typeUser,setTypeUser]=useState("");
    const [resetPass,setResetPass]=useState(false);
    const [isupdated,setisupdated]=useState("");

     async function SendOTP(){
        let type="";
        const email=document.querySelector("input[type='email']").value;

        await axios.get("http://localhost:4000/student/"+email)
        .then(async(res)=>{
            console.log(res);
            if(res.data.length){
                await axios.post("http://localhost:4000/student/resetPassOTP",{"email":res.data[0].email,"firstName":res.data[0].firstName})
                .then((res)=>{
                    console.log("OTP sent.")
                    console.log(res);
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
                await axios.get("http://localhost:4000/teacher/"+email)
            .then( async (res)=>{
                if(res.data.length){
                     await axios.post("http://localhost:4000/teacher/resetPassOTP",{"email":email,"firstName":res.data[0].firstName})
                    .then((res)=>{
                        console.log(res);
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
    function checkOTPAndResetPass(){
        const currOTP=document.getElementById('currOTP').value;
        if(currOTP===otp){
            setResetPass(true);
        }
    }
    function ChangePassword(e){
        e.preventDefault();
        const userEmail=user.email;
        const pass_new=document.getElementById('pass-new').value;
        const pass_confirm=document.getElementById('pass-confirm').value;
            if(pass_new===pass_confirm){
                axios.patch("http://localhost:4000/"+typeUser+"/"+userEmail,{"password":pass_confirm})
                .then((res)=>{
                    console.log("Password updated successfully!!");
                })
                .catch((err)=>console.log(err));
            
                setisupdated("Password updated successfully!!");
            }else{
                setisupdated("Password do not match. Try again!!")
            }
        document.getElementById('pass-new').value="";
        document.getElementById('pass-confirm').value="";

        setTimeout(() => {
            setisupdated("");
        }, 2000);
    }

    useEffect(() => {
        console.log('effect');
        console.log(IsEmailSent);
    },[])
    return (
        <div>
        <div className="home-cont">
        {
            !resetPass&&
            <>
            <div className="welcome-note">
            <h3>Reset Password!!</h3>
            </div>
            <div className="Login-details" >
                <div className="Email-cont">
                    <i class="fa fa-envelope icon"></i>
                    <input type="email" placeholder="Enter Email" />
                </div>{!IsEmailSent&&<input type="submit" value="Send" className="sendOTP" id="sendOTP" onClick={SendOTP}/>}
                {
                    IsEmailSent?
                    <div className="Pass-cont">
                    <i class="fa fa-key icon"></i>
                    <input type="password" id="currOTP"  placeholder="Enter 4-digit OTP sent via mail to above email" />
                    <div><input type="submit" value="Submit"className="checkAndReset-btn" onClick={checkOTPAndResetPass}/></div>
                    </div>:
                    <span>{Error}</span>
                }
            </div>
            </>
        }
        {
         resetPass&&
         <div className="reset-pass-cont">
            <form  onSubmit={ChangePassword}>
                    <div className="welcome-note">
                    <h3>Reset Password!!</h3>
                    </div>
                    <div className="newPAss">New Password:<br /><input type="password" name="new"  id="pass-new" placeholder="Type here.."/></div>
                    <div className="confirmPAss">Confirm Password:<br /><input type="password" name="confirm"  id='pass-confirm' placeholder="Type here.."/></div>
                    <div Style="font-size:1.1rem;color:red;text-align:center;">{isupdated}</div>
                    <div><input type="submit" name="change"  value="Change" className="Reset"/></div>
            </form>
        </div>  
        }
      </div>
        </div>
    )
}

export default ForgotPassword
