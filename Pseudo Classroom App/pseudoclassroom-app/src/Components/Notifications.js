import axios from 'axios'
import React,{useEffect} from 'react'
import "../Css/StudentDashboard.css"

/*
This is the page to show notifications to the student if there is any 
broadcast from any teacher of the courses in which astudent is enrolled

This is rendered in StudentDashboard.js 

 */

function Notifications(props) {

    //This to read all the notifications in the first mounting of this page.

    useEffect(() => {

        //Taking notifications from the parent component which is StudentDashboard.js as props.

       for(let idx=0;idx<props.notifications.length;idx++){
           props.notifications[idx].read=true;
       }
       if(props){
           console.log(props);
            axios.patch("http://localhost:4000/student/"+props.email,{"notifications":props.notifications})
            .then((res)=>console.log("Done"))
            .catch((err)=>console.log(err));
       }
    })

    return (
        <div className="Notifications-cnt">
             <div className="notification-heading">
                <div className="back-button" onClick={()=>{props.setIsNotificationbyProp()}}><i class="fas fa-arrow-circle-left fa-2x"></i></div>
                <div  className="heading">Notifications</div>
                <hr />
            </div>    
            <div className="Notifications scrollbar-hidden">
                {
                    //Render all the notifications for this student.

                    props.notifications.map((notification,key)=>{
                        return (
                        <div className="notification">
                            <h4 className="notification-course-name">{notification.courseId}</h4>
                            <hr />
                            <pre className="message">{notification.Message}</pre>
                        </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Notifications
