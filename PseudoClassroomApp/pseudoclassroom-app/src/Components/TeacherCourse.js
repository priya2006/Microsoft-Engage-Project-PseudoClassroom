import axios from 'axios';
import React,{useState,useEffect} from 'react'
import "../Css/TeacherDashboard.css"
import CriteriaEachDay from './CriteriaEachDay';

/*
This component is for the Course of teacher to display on teacher's Dashboard.
Rendered on TeacherDashboard.js
*/

function TeacherCourse(props) {
    /*
    State to handle whether teacher is looking to edit the criteria
    */
    const [EditCriteria,setEditCriteria]=useState(false);
    /*
    State to handle whether teacher is looking to send a broadcast message to all the students in this course.
    */
    const [IsBroadcast,setIsBroadcast]=useState(false);
    /*
    courseID taken as props from parent component 
    */
    const id=props.courseId;
    /*
    check whether broadcast is sent or not
    */
    const [IsSent,setIsSent]=useState(false);
    /*
    State to store Course details.
    */
    const [course,setCourse]=useState(null);


    /*
    to perform some task at the time of first mounting of component which to fethc the course details for this particular course
    */
    useEffect(() => {
        axios.get("/course/"+id)
        .then((res)=>{
            if(res.data){
                setCourse(res.data);
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    },[]) 
    
    /*
    Task to be perform upon submitting the broadcast message which to send this message as a notification to each student over there.
    */
    async function OnSubmitBroadcast(e){
       //Show user to wait untill message is sent 
      document.querySelector("body").style.cursor="wait";

       //take message from text area
       const msg=document.getElementById("broadcast-message").value;

       //Send them to all the students enrolled in this Course as a notifications.
        for(let idx=0;idx<course.Enrolledstudents.length;idx++){
            const student_id=course.Enrolledstudents[idx];
            console.log(student_id)
            let prevNotifications=[];
            const url= "/student/"+student_id;
            /*
            First fetch their old notifications add new one and then update the notifications
            */
            await axios.get(url)
             .then((res)=>{
                prevNotifications=res.data[0].notifications;
                console.log(prevNotifications); 
                prevNotifications.push({"courseId" :course.courseId,"Message":msg,"read":false });
                axios.patch(url,{"notifications":prevNotifications})
                .then((res)=>{
                    console.log(res);
                }) 
                .catch((err)=>{
                    console.log(err);
                })
             })
             .catch((err)=>{
                 console.log(err);
             })
             
       }
       //when once done proceed them without further waiting
      document.querySelector("body").style.cursor="default";
      setIsSent(true);//Mark message as sent 
       document.getElementById("broadcast-message").value="";


       setTimeout(() => {
              setIsSent(false);
              setIsBroadcast(!IsBroadcast);
        }, 2000);
    }
     
    
 
    return (
        !(course===null)?
        <div className="teacherCourse-cont">
            <div className="teacherCourse-name">{course.courseId}</div>
            <div className="No-of-Students"><i>Number of Students - {course.Enrolledstudents.length}</i> </div>
            <hr />
            <button onClick={()=>{ setEditCriteria(!EditCriteria)}} Style="font-size:1.2rem;">Edit Criteria of Weekly classes</button>
            <button onClick={()=>{setIsBroadcast(!IsBroadcast)}} Style="font-size:1.2rem;">Broadcast Message</button>   
            
           {
           EditCriteria&& 
           <div className="Criteria-cont scrollbar-hidden">
                <div className="class-heading">
                <div className="back-button" onClick={()=> {setEditCriteria(!EditCriteria)}}><i class="fas fa-arrow-circle-left fa-2x"></i></div>
                <div Style="font-size:1.5rem;" className="heading">Criteria for Weekly classes for this course</div>
                <hr Style="width:60%; opacity:0.2;height:0.2rem" />
                </div>
                <div className="Criteria scrollbar-hidden ">
                   {
                   course.Weekdays.length?
                   course.Weekdays.map((day,index) => {
                       return (
                        <CriteriaEachDay id={index} course={course} day={day}/>
                       )
                   })
                   :
                   <div>
                       <pre>Enjoy! there are no classes for this course this week :)</pre>
                   </div>
                    }
                </div>
            </div>
            }
            {
                IsBroadcast&&
                <div className="broadcast-cont">
                    <div className="class-heading">
                    <div className="back-button" onClick={()=> setIsBroadcast(!IsBroadcast)}><i class="fas fa-arrow-circle-left fa-2x"></i></div>
                    <div Style="font-size:1.5rem;" className="heading">Send a broadcast message to all students of this course!</div>
                    <hr Style="opacity:0.2;height:0.2rem;width:88%;margin-left:8rem;" />
                    </div>
                    <div className="message-cont  ">
                    <textarea id="broadcast-message" className="scrollbar-hidden" name="message" rows="5" cols="33" spellcheck="false" placeholder="Announce something to your class.."></textarea>
                    {
                        IsSent&&
                        <div Style="color:red;">Your Broadcast message has been sent to all students!!</div>
                    }
                    </div>
                    <div ><input type="submit"  className="send-broadcast" value="Send" onClick={OnSubmitBroadcast} /></div>
                </div>
            }
        </div>:
        <div></div>  
    )
}

export default TeacherCourse
