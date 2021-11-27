import React,{useState,useEffect} from 'react'
import axios from 'axios'
import "../Css/ProfileOptions.css"

/*
This component is used show the profile details of this user and allow them to edit those. 
Rendered from Student/Teacher'sDashboard.js
*/

function Profile(props) {
    /*
    Store the user details in this state.
    */
    const [userDetails,setUserDetails]=useState(null);
    /*
    Check if details are edited or not.
    */
    const [Isedited,setIsedited]=useState(false);

    /*
    Edit the details after EDIT button is clicked.
    */

    async function EditUserDetails(){
        const userEmail=document.getElementById("user-email");
        const userFName=document.getElementById("user-firstName");
        const userLName=document.getElementById("user-lastName");

        const data={
                    "email":userEmail.value===""?userEmail.placeholder:userEmail.value,
                    "firstName":userFName.value===""?userFName.placeholder:userFName.value,
                    "lastName":userLName.value===""?userLName.placeholder:userLName.value
                   };
         setIsedited(true);
        setTimeout(() => {
            setIsedited(false);
        }, 2000);
        
        //Edit the details in DB.
        await axios.patch("/"+props.type+"/"+props.email,data)
        .then((res)=>{
            
            console.log(res)
        })
        .catch((err)=>console.log(err))  
        
        userEmail.placeholder=userEmail.value===""?userEmail.placeholder:userEmail.value;
        userFName.placeholder=userFName.value===""?userFName.placeholder:userFName.value;
        userLName.placeholder=userLName.value===""?userLName.placeholder:userLName.value;

        userEmail.value="";
        userFName.value="";
        userLName.value="";

        userLName.opacity=0.5;
        userFName.opacity=0.5;
        userLName.opacity=0.5;
       
    }

    //Fetch the user details in the first mounting of this component.
    useEffect(() => {
        axios.get("/"+props.type+"/"+props.email)
        .then((res)=>{
            if(res.data.length){
                setUserDetails(res.data[0]);
            }
        })
        .catch((err)=>{
            console.log(err);
        })
        
    },[])
    
    return (
        <div className="Profile">
            <div className="profile-heading">
                <div className="back-button" onClick={()=>{props.setIsProfilebyProp()}}><i class="fas fa-arrow-circle-left fa-2x"></i></div>
                <div  className="heading">Profile</div>
                <hr />
            </div>
               {
                   userDetails!==null?
                   <div  className="profile-info">
                       <div className="user-email">
                           <label for="email">Email:</label><br />
                          
                           {/* Cannot edit details untill the edit icon in not clicked */}

                           <input type="email" placeholder={userDetails.email}  name="email" className="email" id="user-email" /><i class="fas fa-pencil-alt" onClick={()=>{
                               const userEmail=document.getElementById("user-email");
                               document.querySelector(".email").style.cursor="default";
                               userEmail.style.opacity=1;
                               userEmail.value=userDetails.email;
                               userEmail.placeholder="";
                               userEmail.addEventListener("onchange",(e)=>{
                               userEmail.value=e.target.value;
                               })
                           }}></i>
                       </div>
                       <div className="user-first-name">
                           <label for="f-name">First Name:</label><br />
                           <input type="text" placeholder={userDetails.firstName} name="f-name" className="f-name"  id="user-firstName" /><i class="fas fa-pencil-alt" onClick={()=>{
                               const userFName=document.getElementById("user-firstName");
                               document.querySelector(".f-name").style.cursor="default";
                                userFName.style.opacity=1;
                                userFName.value=userDetails.firstName;
                                userFName.placeholder="";
                                userFName.addEventListener("onchange",(e)=>{
                                    userFName.value=e.target.value;
                                })
                           }}></i>
                       </div>
                       <div className="user-last-name">
                           <label for="l-name">Last Name:</label><br />
                           <input type="text" placeholder={userDetails.lastName}  name="l-name" className="l-name" id="user-lastName" /><i class="fas fa-pencil-alt" onClick={()=>{
                               const userLName=document.getElementById("user-lastName");
                               document.querySelector(".l-name").style.cursor="default";
                               userLName.style.opacity=1;
                               userLName.value=userDetails.lastName ;
                               userLName.placeholder="";
                               userLName.addEventListener("onchange",(e)=>{
                               userLName.value=e.target.value;
                               })
                           }}></i>
                       </div>
                       { 
                       Isedited&&
                       <div Style="color:red;">Your details has been Updated!!</div>
                       }
                       <div className="Edit-btn" onClick={EditUserDetails}>
                           Edit 
                       </div>
                   </div>:
                   <div className="loader profile-info"></div>
               }
           </div>
    )
}

export default Profile

