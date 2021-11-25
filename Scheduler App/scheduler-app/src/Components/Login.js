import React,{useState,useEffect,useContext} from 'react'
import axios from 'axios';
import {Link} from 'react-router-dom';
import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard"
import "../Css/Login.css"

function Login(props) {
    const [isNoUSer,changeIsNoUser]=useState(true);
    const [isStudent,changeisStudent]=useState(false);
    const [isTeacher,changeisTeacher]=useState(false);
    const [Error,changeError]=useState("");
    const [user,setUser]=useState(null);
    const [isForgotPassword,setisForgotPassword]=useState(false);
    

    async function OnSubmitCredentials(e){
        e.preventDefault();
        document.querySelector("body").style.cursor="wait";
        document.querySelector(".login-btn").style.cursor="wait";
         const email=document.querySelector("input[type='email']").value;
         const pass=document.querySelector("input[type='password']").value;
         console.log(user);
         if(props.TypeUser==="Student"){
            await axios.get("http://localhost:4000/student/"+email)
            .then((res)=>{
                if(res.data.length>0){
                    const student=res.data[0];
                    if(student.password===pass){
                        changeisStudent(true);
                        changeIsNoUser(false);
                        setUser(student);
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
           await axios.get("http://localhost:4000/teacher/"+email)
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
    useEffect(() => {
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
