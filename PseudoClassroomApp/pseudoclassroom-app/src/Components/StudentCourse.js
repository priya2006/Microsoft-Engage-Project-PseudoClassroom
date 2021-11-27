import React,{useState,useEffect} from 'react'
import axios from 'axios'
import "../Css/StudentDashboard.css"
import PreferrenceEachDay from './PreferrenceEachDay';

/*
This component is for each Course in which student is enrolled.
Rendered from StudentDashboard.js
*/

function StudentCourse(props) {
    /*
    check is student is giving preferrence or not so that to show him/her the forms for each day class in a week.
    */
    const [isPreferrence,setPreferrence]=useState(false);
    //Course Id 
    const id=props.id;
    //store the teacher name to render for this course
    const [TeacherName,setTeacherName]=useState("");
    //Store the data related to this particular course.
    const [course,setCourse]=useState(null);

    //Store the details for this course first time of mounting of this component in course state to use in for further component;

     useEffect(() => {
         axios.get("/course/"+id)
        .then((res)=>{
            if(res){
                console.log("res:",res)
                setCourse(res.data);
                if(res.data){
                    //when you get course now fetch the teacher details of that course from DB to use it.
                    axios.get("/teacher/"+res.data.teacherId)
                    .then((res)=>{
                        if(res){
                            console.log("res tea",res)
                            setTeacherName(res.data[0].firstName+' '+res.data[0].lastName);
                        }
                    })
                    .catch(err =>{
                        console.log(err);
                    })
                }
            }
        })
        .catch(err =>{
            console.log(err);
        })

    },[])


    return (
        !(course===null)?
        <div className="Course-cont">
            <div className="course-name">{course.courseId}</div>
            <div className="teacher-name">{TeacherName}</div>
            <hr />
            <button onClick={()=> setPreferrence(!isPreferrence)}>Class Preferrence</button>
           {
               //If preferrence button is clicked to give preferrence show the form to fill in the preferrence
           isPreferrence&& 
           <div className="Preferrence-cont scrollbar-hidden">
                <div className="class-heading">
                <div className="back-button" onClick={()=> setPreferrence(!isPreferrence)}><i class="fas fa-arrow-circle-left fa-2x"></i></div>
                <div Style="font-size:1.5rem;" className="heading">Preferrences for Course Name</div>
                <hr Style="width:60%; opacity:0.2;height:0.2rem" />
                </div>
                <div className="Preferrences scrollbar-hidden ">
                  {
                       course.Weekdays.length?
                       course.Weekdays.map((day,index) => {
                           return (
                            <PreferrenceEachDay id={index} course={course} day={day} studentId={props.studentId}/>
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
        </div>  :
        <div></div>
    )
}

export default StudentCourse
