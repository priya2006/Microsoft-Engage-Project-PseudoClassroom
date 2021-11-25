import axios from 'axios';
import React,{useState,useEffect} from 'react'
import "../Css/TeacherDashboard.css"

import CriteriaEachDay from './CriteriaEachDay';

function TeacherCourse(props) {
    const [EditCriteria,setEditCriteria]=useState(false);
    const [IsBroadcast,setIsBroadcast]=useState(false);
    const id=props.courseId;
    const [IsSent,setIsSent]=useState(false);
    const [course,setCourse]=useState(null);

    useEffect(() => {
        axios.get("http://localhost:4000/course/"+id)
        .then((res)=>{
            if(res.data){
                setCourse(res.data);
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    }) 
    
    async function OnSubmitBroadcast(e){
      document.querySelector("body").style.cursor="wait";

       const msg=document.getElementById("broadcast-message").value;
        for(let idx=0;idx<course.Enrolledstudents.length;idx++){
            const student_id=course.Enrolledstudents[idx];
            console.log(student_id)
            let prevNotifications=[];
            const url= "http://localhost:4000/student/"+student_id;
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
      document.querySelector("body").style.cursor="default";
      setIsSent(true);
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
                       console.log(index);
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
