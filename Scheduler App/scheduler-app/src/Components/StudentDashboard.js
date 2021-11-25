import React,{useState,useContext,useEffect} from 'react'
import Header from "./Header";
import Footer from "./Footer";
import StudentCourse from './StudentCourse';
import Profile from './Profile';
import Notifications from './Notifications';
import Settings from './Settings';
import { Link } from 'react-router-dom';
import FAQ from './FAQ';
import "../Css/StudentDashboard.css"
import Student from './Student';
import axios from 'axios';


function StudentDashboard(props) {
    const UserFirstName="User", UserFullName="First-Last Name";
    const [onProfileBtn,setonProfilebtn]=useState(false);
    const [IsProfile,setIsProfile]=useState(false);
    const [IsNotification,setIsNotification]=useState(false);
    const [countNotifications,setCountNotifications]=useState(1);
    const [IsSettings,setIsSettings]=useState(false);
    const [IsStudent,setIsStudent]=useState(false);
    const [StickyNotes,setStickyNotes]=useState(JSON.parse(localStorage.getItem("StickyNotes"))||[]);
    const [StickyNoteCount,setStickyNoteCount]=useState(StickyNotes.length+1);

    const [IsFAQ,setIsFAQ]=useState(false);
    const student=props.student;
    function changeNotificationCount(){
        if(props.student){
            setIsStudent(true);
            console.log(IsStudent);
            console.log(student.notifications)
            let unReadNotifications=student.notifications.filter((notification,key)=>{
                return notification.read===false;
            })
            setCountNotifications(unReadNotifications.length);
        }
    }
    function minimizeAndRemove(minimize, remove, stickyNotes){
        remove.addEventListener("click", (e) => {
            let NoteID=parseInt(stickyNotes.getAttribute("id"));
            const stickyNotesCurr=StickyNotes;
            let index=SearchID(stickyNotesCurr,NoteID);
            stickyNotesCurr.splice(index,1);
            setStickyNotes(stickyNotesCurr);
            stickyNotes.remove();
            localStorage.setItem("StickyNotes",JSON.stringify(StickyNotes));
        })
        minimize.addEventListener("click", (e) => {
            const icon=e.target;
            if(icon.getAttribute("class")==="fas fa-window-minimize MinimizeIcon"){
                icon.setAttribute("class","far fa-window-maximize MinimizeIcon")
            }else if(icon.getAttribute("class")==="far fa-window-maximize MinimizeIcon"){
                icon.setAttribute("class","fas fa-window-minimize MinimizeIcon")
            }
            let note = stickyNotes.querySelector(".note-cont");
            let display = getComputedStyle(note).getPropertyValue("display");
            if (display === "none") note.style.display = "block";
            else note.style.display = "none";
        })
        
    }
    function MoveNotesOverDashboard(stickyNotes, e){
        let shiftX = e.clientX - stickyNotes.getBoundingClientRect().left;
        let shiftY = e.clientY - stickyNotes.getBoundingClientRect().top;

        stickyNotes.style.position = 'absolute';
        stickyNotes.style.zIndex = 1000;
    
        moveAt(e.pageX, e.pageY);
    
        function moveAt(pageX, pageY) {
            stickyNotes.style.left = pageX - shiftX + 'px';
            stickyNotes.style.top = pageY - shiftY + 'px';
        }
    
        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }
    
        document.addEventListener('mousemove', onMouseMove);
    
        stickyNotes.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            stickyNotes.onmouseup = null;
        };

    }
    function SearchID(StickyNotesCurr,id){
        console.log(StickyNotesCurr,id);
        for(let i=0;i<StickyNotesCurr.length;i++){
            if(StickyNotesCurr[i]["id"]===id){
                return i;
            }
        }
        return 0;
    }
    function createStickyNote(StickyNoteTemplate,StickyNote=null){

        if(StickyNote===null){
            let stickyNotes = document.createElement("div");
            stickyNotes.setAttribute("class", "sticky-cont");
            stickyNotes.setAttribute("id",StickyNoteCount);
            let currID=StickyNoteCount;
            setStickyNoteCount(StickyNoteCount+1);

            stickyNotes.innerHTML = StickyNoteTemplate;
            document.body.appendChild(stickyNotes);
            let stickyNotesCurr=StickyNotes;
            
            let minimize = stickyNotes.querySelector(".minimize");
            let remove = stickyNotes.querySelector(".remove");

            console.log(stickyNotes.childNodes);

            const noteArea=stickyNotes.childNodes[3].childNodes[1];
            noteArea.onchange=(e)=>{

                const Stickynote=(e.target.parentElement).parentElement;
                let NoteID=parseInt(Stickynote.getAttribute("id"));
                const stickyNotesCurr=StickyNotes;
                let index=SearchID(stickyNotesCurr,NoteID);
                console.log(index);
                stickyNotesCurr[index]["Note"]=e.target.value;
                setStickyNotes(stickyNotesCurr);
                localStorage.setItem("StickyNotes",JSON.stringify(StickyNotes));
            };

            const TitleArea=stickyNotes.childNodes[1].childNodes[1];
            TitleArea.addEventListener("input", (e) => {
            
                const Stickynote=(e.target.parentElement).parentElement;
                let NoteID=parseInt(Stickynote.getAttribute("id"));
                const stickyNotesCurr=StickyNotes;
                let index=SearchID(stickyNotesCurr,NoteID);
                // console.log(index);
                stickyNotesCurr[index]["title"]=e.target.innerHTML;
                setStickyNotes(stickyNotesCurr);
                localStorage.setItem("StickyNotes",JSON.stringify(StickyNotes));
            });
            stickyNotesCurr.push({"title":TitleArea.innerHTML,"Note":noteArea.value,"id":currID});
            setStickyNotes(stickyNotesCurr);
            localStorage.setItem("StickyNotes",JSON.stringify(StickyNotes));

            minimizeAndRemove(minimize, remove, stickyNotes);
    
            stickyNotes.onmousedown = function (e) {
                MoveNotesOverDashboard(stickyNotes, e);
            };
        
            stickyNotes.ondragstart = function () {
                return false;
            };
            

        }else{
            let stickyNotes = document.createElement("div");
            stickyNotes.setAttribute("class", "sticky-cont");
            stickyNotes.setAttribute("id",StickyNote["id"]);
            let currID=StickyNoteCount;

            stickyNotes.innerHTML = StickyNoteTemplate;
            document.body.appendChild(stickyNotes);
            let stickyNotesCurr=StickyNotes;
            
            let minimize = stickyNotes.querySelector(".minimize");
            let remove = stickyNotes.querySelector(".remove");

            console.log(stickyNotes.childNodes);
            const noteArea=stickyNotes.childNodes[2].childNodes[1];
            noteArea.onchange=(e)=>{
                const Stickynote=(e.target.parentElement).parentElement;
                let NoteID=parseInt(Stickynote.getAttribute("id"));
                const stickyNotesCurr=StickyNotes;
                let index=SearchID(stickyNotesCurr,NoteID);
                stickyNotesCurr[index]["Note"]=e.target.value;
                setStickyNotes(stickyNotesCurr);
                localStorage.setItem("StickyNotes",JSON.stringify(StickyNotes));
            };

            const TitleArea=stickyNotes.childNodes[0].childNodes[1];
            TitleArea.addEventListener("input", (e) => {
            
                const Stickynote=(e.target.parentElement).parentElement;
                let NoteID=parseInt(Stickynote.getAttribute("id"));
                const stickyNotesCurr=StickyNotes;
                let index=SearchID(stickyNotesCurr,NoteID);
                // console.log(index);
                stickyNotesCurr[index]["title"]=e.target.innerHTML;
                setStickyNotes(stickyNotesCurr);
                localStorage.setItem("StickyNotes",JSON.stringify(StickyNotes));
            });
            noteArea.value=StickyNote["Note"];
            TitleArea.innerHTML=StickyNote["title"];
            // minimize.click();
            minimizeAndRemove(minimize, remove, stickyNotes);
    
            stickyNotes.onmousedown = function (e) {
                MoveNotesOverDashboard(stickyNotes, e);
            };
        
            stickyNotes.ondragstart = function () {
                return false;
            };
        }

    }

   useEffect(() => {
       changeNotificationCount();  
   })

   useEffect(() => {
    StickyNotes.forEach((StickyNoteData)=>{
        console.log(StickyNoteData)
        let stickyTemplate=
                `<div class="header-Sticky-cont">
                <div class="title" contenteditable="true" spellcheck="false"></div>
                <div class="minimize"><i class="fas fa-window-minimize MinimizeIcon"></i></div>
                <div class="remove"><i class="fa fa-times" aria-hidden="true"></i></div>
                </div>
                <div class="note-cont">
                    <textarea spellcheck="false" ></textarea>
                    </div>
                `;
            createStickyNote(stickyTemplate,StickyNoteData);
    })
   }, [])


   useEffect(() => {
    // getPreviosNotesandDisplay(); 
    localStorage.setItem("StickyNotes",JSON.stringify(StickyNotes));
   },[StickyNotes])
   
   useEffect(() => {
        if(localStorage.getItem("StickyNotes")!==null) {
            setStickyNotes(JSON.parse(localStorage.getItem("StickyNotes")));
        }
   }, [])

    return (
        student!==null?
        <div>
            <Header />
              <div className="Profile-cont">
                  <div className="Profile-name-btn">
                    <div className="Profile-name">
                        <h3>Hello, {student.firstName}!</h3>
                    </div>    
                    <div className="Profile-btn" onClick={()=>{
                        setonProfilebtn(!onProfileBtn)
                        setIsNotification(false);
                        setIsProfile(false);
                        setIsSettings(false);
                        setIsFAQ(false);
                        
                    }}>
                    {student.firstName[0]+student.lastName[0]}
                    {/* <i class="fas fa-user-graduate fa-2x"></i> */}
                    </div>
                  </div>  
                  {/* <i class="fas fa-caret-up fa-lg tip-profile-box"></i> */}
                  {
                  onProfileBtn &&    
                  <div className="Profile-box">
                     <h2>{student.firstName+' '+student.lastName}<br /><p Style="font-size:1rem;">Student</p><hr /></h2> 
                     <div onClick={()=>{

                            if(IsNotification)setIsNotification(false);
                            if(IsSettings)setIsSettings(false);
                            if(IsFAQ)setIsFAQ(false);

                            setIsProfile(!IsProfile)

                    }}><i class="far fa-user" ></i>Profile</div>
                     <div onClick={()=>{

                            if(IsProfile)setIsProfile(false);
                            if(IsSettings)setIsSettings(false);
                            if(IsFAQ)setIsFAQ(false);

                            setIsNotification(!IsNotification)

                         }}><i class="fas fa-bell" ></i>
                               {countNotifications!==0&&<span className="alert-notifications">{countNotifications}</span> }
                                Notifications
                     </div>
                     <div onClick={()=>{

                            if(IsProfile)setIsProfile(false);
                            if(IsNotification)setIsNotification(false);
                            if(IsFAQ)setIsFAQ(false);

                            setIsSettings(!IsSettings) 

                        }}><i class="fas fa-cog" ></i>Settings</div>
                     <div onClick={()=>{

                            if(IsProfile)setIsProfile(false);
                            if(IsNotification)setIsNotification(false);
                            if(IsSettings)setIsSettings(false);


                            setIsFAQ(!IsFAQ)

                         }}><i class="fas fa-question"></i>FAQ</div>
                     <div onClick={()=>{
                        const stickyNotes=document.querySelectorAll(".sticky-cont");
                        stickyNotes.forEach((note)=>{
                            note.remove();
                        })

                        const type=localStorage.getItem("type");
                        localStorage.removeItem("User");
                        localStorage.removeItem("type");
                        localStorage.removeItem("StickyNotes")
                        window.history.back();
                     }}><i class="fas fa-sign-out-alt"></i>Log out</div>
                  </div>
                  }
                  {
                      IsProfile&&
                        <Profile setIsProfilebyProp={()=>{setIsProfile(!IsProfile)}} email={student.email} type="student"/> 
                 }
                 {
                      IsNotification&&
                        <Notifications  setIsNotificationbyProp={()=>{setIsNotification(!IsNotification)}} email={student.email} notifications={student.notifications} />
                 }
                 {
                      IsSettings&&
                        <Settings setIsSettingsbyProp={()=>setIsSettings(!IsSettings)} type="student" email={student.email} user={student}/>
                 }
                 {
                      IsFAQ&&
                        <FAQ setIsFAQ={()=>setIsFAQ(!IsFAQ)} />
                 }
              </div>
              
              <div className="Courses-cont scrollbar-hidden">
                  {
                      student.courses.length>0&&
                      student.courses.map(course => {
                         return <StudentCourse id={course} studentId={student.email}/>
                      })
                  }
              </div>
              {console.log('Notes:',StickyNotes)}
              <div className="StickyNote"><img src="StickyNote.svg" className="Notes" title="Sticky Notes" alt="Sticky" onClick={()=>{
                  let stickyTemplate = `
                  <div class="header-Sticky-cont">
                      <div class="title" contenteditable="true" spellcheck="false"></div>
                      <div class="minimize"><i class="fas fa-window-minimize MinimizeIcon"></i></div>
                      <div class="remove"><i class="fa fa-times" aria-hidden="true"></i></div>
                  </div>
                  <div class="note-cont">
                      <textarea spellcheck="false" ></textarea>
                  </div>
                  `;
                  createStickyNote(stickyTemplate);
              }}/></div>
            <Footer />
        </div>:
        <div>
            <Header />
            <h3>Something went Wrong. Please try again later!!!</h3>
            <Footer />
        </div>
    )
}

export default StudentDashboard
