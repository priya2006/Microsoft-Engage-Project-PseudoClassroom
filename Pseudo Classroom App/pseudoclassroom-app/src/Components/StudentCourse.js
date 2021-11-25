import React,{useState,useEffect} from 'react'
import axios from 'axios'
// import "../App.css";
import "../Css/StudentDashboard.css"
import PreferrenceEachDay from './PreferrenceEachDay';

function StudentCourse(props) {
    const [isPreferrence,setPreferrence]=useState(false);
  
    
    const id=props.id;
    const [TeacherName,setTeacherName]=useState("");
    const [course,setCourse]=useState(null);

     useEffect(() => {
         axios.get("http://localhost:4000/course/"+id)
        .then((res)=>{
            if(res){
                console.log("res:",res)
                setCourse(res.data);
                if(res.data){
            
                    axios.get("http://localhost:4000/teacher/"+res.data.teacherId)
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
            {/* {console.log(course)} */}
            <div className="course-name">{course.courseId}</div>
            <div className="teacher-name">{TeacherName}</div>
            <hr />
            <button onClick={()=> setPreferrence(!isPreferrence)}>Class Preferrence</button>
           {
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
