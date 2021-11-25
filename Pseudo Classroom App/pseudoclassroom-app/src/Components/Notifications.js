import axios from 'axios'
import React,{useEffect,useState} from 'react'
import "../Css/StudentDashboard.css"

function Notifications(props) {
    useEffect(() => {
       for(let idx=0;idx<props.notifications.length;idx++){
           props.notifications[idx].read=true;
       }
       console.log('notif props:',props.notifications);
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
