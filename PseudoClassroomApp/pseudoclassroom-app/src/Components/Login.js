import React,{useState,useEffect,useContext} from 'react'
import axios from 'axios';
import {Link} from 'react-router-dom';
import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard"
import "../Css/Login.css"

//Login page of the website so that user can enter his/her credentials to login to the website.

function Login(props) {
    const [isNoUSer,changeIsNoUser]=useState(true);//If credentials is not entered then show the form to enter crednetials
    
    /*If entered credentials then which type of user is this if student then show student dashboard for that student */
    const [isStudent,changeisStudent]=useState(false);
    
    /*If entered credentials then which type of user is this if teacher then show teacher dashboard for that teacher */ 
    const [isTeacher,changeisTeacher]=useState(false);
    
    const [Error,changeError]=useState("");//If there is any error logging in the user
    const [user,setUser]=useState(null);//If user details are taken or not
    
     //Functions to perform tasks upon submitting credentials
     function OnSubmitCredentials(e){
        e.preventDefault();
        document.querySelector("body").style.cursor="wait";
        document.querySelector(".login-btn").style.cursor="wait";
         const email=document.querySelector("input[type='email']").value;
         const pass=document.querySelector("input[type='password']").value;
         console.log(user);
         
         //If user is student search in Student DB.

         if(props.TypeUser==="Student"){
             axios.get("http://localhost:4000/student/"+email)
            .then((res)=>{
                if(res.data.length>0){
                    const student=res.data[0];
                    if(student.password===pass){
                        changeisStudent(true);
                        changeIsNoUser(false);
                        setUser(student);
                        
                        /*Storing the Id of the user in the Localstorage to maintian the
                         session of that user untill he/she logged out*/

                        localStorage.setItem("User",student.email);
                        localStorage.setItem("type","student");
                        console.log("student",student);
                        document.querySelector("body").style.cursor="default";
                        document.querySelector(".login-btn").style.cursor="default";
                        console.log(user);
                    }else{
                        changeError("Incorrect Password!!")
                    }
                }else{
                    changeError("Email not found!!!");
                }
            })
            .catch(err => console.log(err));
            
         }else if(props.TypeUser==="Teacher") {

            //If type of the user is teacher,search in teacher DB


            axios.get("http://localhost:4000/teacher/"+email)
            .then((res)=>{
                if(res.data.length>0){
                    const teacher=res.data[0]
                    if(teacher.password===pass){
                        changeisTeacher(true);
                        localStorage.setItem("User",teacher.email);
                        changeIsNoUser(false);
                        localStorage.setItem("type","teacher");
                        setUser(teacher);
                        document.querySelector("body").style.cursor="default";
                        document.querySelector(".login-btn").style.cursor="default";
                        
                    }else{
                        changeError("Incorrect Password!!")
                    }
                }else{
                    changeError("Email not found!!!");
                }
            })
            .catch(err => console.log(err));
         }
         setTimeout(() => {
             changeError("");
         }, 2000);
         
    }
    
    /* If student is there fetch student details */

    async function getStudent(email){
        await axios.get("http://localhost:4000/student/"+email)
            .then((res)=>{
                if(res.data.length>0){
                    const student=res.data[0];
                    setUser(student);
                }
            })
            .catch(err => console.log(err));
    }

    /*If Teacher is there fetch teacher details */
    async function getTeacher(email){
        await axios.get("http://localhost:4000/teacher/"+email)
        .then((res)=>{
            if(res.data.length>0){
                const teacher=res.data[0]
                setUser(teacher);
            }
        })
        .catch(err => console.log(err));
    }

    //If in the  starting there is someone already loggedin, and stored in local storage then use it untill that person didn't loggedout.  
    useEffect(() => {
       
        //If there is someone then take that else  show login page.

        if(localStorage.getItem("User") === null){
            changeIsNoUser(true);
            console.log("no")
        }else{
            const email=localStorage.getItem("User");
            const type=localStorage.getItem("type");
            changeIsNoUser(false);
            console.log(type);
            if(type==="student" && props.TypeUser==="Student"){
            changeisStudent(true);
            getStudent(email);
            }
            else if(type==="teacher" && props.TypeUser==="Teacher"){
            changeisTeacher(true);
            getTeacher(email);
            }else{
                changeIsNoUser(true);
            }
        }
    },[])
    return (
        <div>
        {
        isNoUSer?
        <div className="home-cont login-css">
            <div className="welcome-note">
            <h3>Welcome again, as a {props.TypeUser}! </h3>
            </div>
            <form className="Login-details" onSubmit={OnSubmitCredentials}>
                <div className="Email-cont">
                    <i class="fa fa-envelope icon"></i>
                    <input type="email" className="newUserEmail" placeholder="Enter Email" />
                </div>  
                <div className="Pass-cont">
                    <i class="fa fa-key icon"></i>
                    <input type="password" className="newUserPass"  placeholder="Enter Password" /><br />
                    <span>{Error}</span>
                </div>
                <div><input type="submit" value="Login"className="login-btn" /></div>
                <Link to='/resetPassword' Style="color:#666b72">Forget Password?</Link>
            </form>
        </div>:
        isStudent?
        <StudentDashboard student={user} />:
        isTeacher?
        <TeacherDashboard teacher={user}/>:
        <div>
            Something went wrong!!, Please try again later! 
        </div>

        }
        </div>
    )
}

export default Login
