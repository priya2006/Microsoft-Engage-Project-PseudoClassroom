import React,{useState,useEffect} from 'react'
import StudentCourse from './StudentCourse';
import Profile from './Profile';
import Notifications from './Notifications';
import Settings from './Settings';
import FAQ from './FAQ';
import "../Css/StudentDashboard.css"

/*
This is the Dashboard component for student to display functionalities for the student and sticky Notes
*/

function StudentDashboard(props) {
    /*
    This is to handle state of Profile button which the user button on righmost top button which will show 
    the further profile options to visit like profile details,Settings to change password, Notifications, 
    FAQ and Logout from profile.
    */
    const [onProfileBtn,setonProfilebtn]=useState(false);
    /*
    State to handle profile window on which there are details of the user to be edited.
    */
    const [IsProfile,setIsProfile]=useState(false);
    /*
    State to handle Notification window 
    */
    const [IsNotification,setIsNotification]=useState(false);
    /*
    State to count unread Notifications to show there so that user will be aware of new notifications. 
    */
    const [countNotifications,setCountNotifications]=useState(1);
    /*
    State to handle Settings window to change the password
    */
    const [IsSettings,setIsSettings]=useState(false);
    /*
    State to check whether Student details are fetched or not
    */
    const [IsStudent,setIsStudent]=useState(false);
    /*
    State to Store StickyNotes Details
    */
    const [StickyNotes,setStickyNotes]=useState(JSON.parse(localStorage.getItem("StickyNotes"))||[]);
    /*
    Count the number of Stickynotes to give unique ID to each one of them.
    */
    const [StickyNoteCount,setStickyNoteCount]=useState(StickyNotes.length+1);
    /*
    State to handle FAQ window to answer some frequently asked quesitons
    */
    const [IsFAQ,setIsFAQ]=useState(false);
    //Fetch student details fron props get from Parent Component.
    const student=props.student;

    /*
    Function to count Notifications which are unread.
    */
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
    /*
    function to perform the funtioning of minimize and remove of Stickynotes
    */
    function minimizeAndRemove(minimize, remove, stickyNotes){
        /*
        Remove the sticky which means delete it from the UI and Data
        */
        remove.addEventListener("click", (e) => {
            let NoteID=parseInt(stickyNotes.getAttribute("id"));
            const stickyNotesCurr=StickyNotes;
            let index=SearchID(stickyNotesCurr,NoteID);
            stickyNotesCurr.splice(index,1);
            setStickyNotes(stickyNotesCurr);
            stickyNotes.remove();
            localStorage.setItem("StickyNotes",JSON.stringify(StickyNotes));
        })
        /*
        Minimize the textarea part of the stickynote to minimze it in the window.
        */
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
    /*
    Drag and drop the StickyNote using this function over the screen to place it anywhere on the screen
    */
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
    /*
    Search the index of stickynote  in the StickyNotes arrray using the id of the stickynote.
    */
    function SearchID(StickyNotesCurr,id){
        console.log(StickyNotesCurr,id);
        for(let i=0;i<StickyNotesCurr.length;i++){
            if(StickyNotesCurr[i]["id"]===id){
                return i;
            }
        }
        return 0;
    }
    /*
    Creates the Sticky Note on the Screen with the given template
    */
    function createStickyNote(StickyNoteTemplate,StickyNote=null){

        //This if block is for when new Stickynote is created which doesn't have any information in it 

        if(StickyNote===null){
            
            let stickyNotes = document.createElement("div");
            stickyNotes.setAttribute("class", "sticky-cont");//set the css class to sticky note container
            stickyNotes.setAttribute("id",StickyNoteCount);//unique of eachsticky note
            //Id of this Stickynote
            let currID=StickyNoteCount;
            //change the Count of note for next sticky ntoe
            setStickyNoteCount(StickyNoteCount+1);
            //give template to this Sticky note
            stickyNotes.innerHTML = StickyNoteTemplate;
            //append to the body
            document.body.appendChild(stickyNotes);

            //Take the curr StickyNotes
            let stickyNotesCurr=StickyNotes;
            
            let minimize = stickyNotes.querySelector(".minimize");
            let remove = stickyNotes.querySelector(".remove");

            /*
            Add the onChange Event on the text area where note will be written whenever any 
            data inside that changes it should be changed in the stickyNote Array at the Id of 
            that Stickynote as well to maintain the consistency.
            */
            const noteArea=stickyNotes.childNodes[3].childNodes[1];
            noteArea.onchange=(e)=>{

                const Stickynote=(e.target.parentElement).parentElement;
                let NoteID=parseInt(Stickynote.getAttribute("id"));
                const stickyNotesCurr=StickyNotes;
                let index=SearchID(stickyNotesCurr,NoteID);
                //Update the data in StickyNotes State array at the index of that same id.
                stickyNotesCurr[index]["Note"]=e.target.value;
                setStickyNotes(stickyNotesCurr);
                /*
                Update the StickyNotes Array at each time when the there is any State change
                 in it to the local storage to get it back
                */
                localStorage.setItem("StickyNotes",JSON.stringify(StickyNotes));
            };

            
            /*
            Add the onChange Event on the title area where title will be written whenever any 
            data inside that changes it should be changed in the stickyNote Array at the Id of 
            that Stickynote as well to maintain the consistency.
            */
            const TitleArea=stickyNotes.childNodes[1].childNodes[1];
            TitleArea.addEventListener("input", (e) => {
            
                const Stickynote=(e.target.parentElement).parentElement;
                let NoteID=parseInt(Stickynote.getAttribute("id"));
                const stickyNotesCurr=StickyNotes;
                let index=SearchID(stickyNotesCurr,NoteID);
                //Update the data in StickyNotes State array at the index of that same id.
                stickyNotesCurr[index]["title"]=e.target.innerHTML;
                setStickyNotes(stickyNotesCurr);
                /*
                Update the StickyNotes Array at each time when the there is any State change
                 in it to the local storage to get it back
                */
                localStorage.setItem("StickyNotes",JSON.stringify(StickyNotes));
            });
            /*
            Push the StickyNote in the Prev array and change the state
            */
            stickyNotesCurr.push({"title":TitleArea.innerHTML,"Note":noteArea.value,"id":currID});
            setStickyNotes(stickyNotesCurr);
            /*
                Update the StickyNotes Array at each time when the there is any State change
                in it to the local storage to get it back
            */
            localStorage.setItem("StickyNotes",JSON.stringify(StickyNotes));

            //attach the Event handlers at minimize and Remove buttons
            minimizeAndRemove(minimize, remove, stickyNotes);
            /*
            when mouse is down on the sticky note start drag and drop
            */
            stickyNotes.onmousedown = function (e) {
                MoveNotesOverDashboard(stickyNotes, e);
            };
        
            stickyNotes.ondragstart = function () {
                return false;
            };

            const x = document.getElementById("notify-Note-Opening");
            x.className = "show";
                setTimeout(function(){
                    x.className = x.className.replace("show", "");
            }, 5000);

        }else{
            /*
            Else block is for when data is again render on the screen from local storage 
            at that we already have values/Data of the StickyNote so we will juts simply 
            put that data everything else is same
            */
            let stickyNotes = document.createElement("div");
            stickyNotes.setAttribute("class", "sticky-cont");
            stickyNotes.setAttribute("id",StickyNote["id"]);

            stickyNotes.innerHTML = StickyNoteTemplate;
            document.body.appendChild(stickyNotes);
            
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
                stickyNotesCurr[index]["title"]=e.target.innerHTML;
                setStickyNotes(stickyNotesCurr);
               
                localStorage.setItem("StickyNotes",JSON.stringify(StickyNotes));
            });
            //Changing the values of note and title with data we get from parameter.
            noteArea.value=StickyNote["Note"];
            TitleArea.innerHTML=StickyNote["title"];

            minimizeAndRemove(minimize, remove, stickyNotes);
    
            stickyNotes.onmousedown = function (e) {
                MoveNotesOverDashboard(stickyNotes, e);
            };
        
            stickyNotes.ondragstart = function () {
                return false;
            };
            const x = document.getElementById("notify-Note-Opening");
                x.className = "show";
                setTimeout(function(){
                    x.className = x.className.replace("show", "");
            }, 5000);
        }

        

    }
    /*
    count of unread notification will be when Component will mount for the first time itself.
    */
   useEffect(() => {
       changeNotificationCount();  
   })

   /*
   Render the Sticky Note who are there in the local storage and not on UI upon refreshing or reloading
   */

   useEffect(() => {
    StickyNotes.forEach((StickyNoteData)=>{

        //Template for the Sticky Note
        let stickyNoteTemplate=
                `<div class="header-Sticky-cont">
                <div class="title" contenteditable="true" spellcheck="false">Title</div>
                <div class="minimize"><i class="fas fa-window-minimize MinimizeIcon"></i></div>
                <div class="remove"><i class="fa fa-times" aria-hidden="true"></i></div>
                </div>
                <div class="note-cont">
                    <textarea spellcheck="false" placeholder="Type Notes"></textarea>
                    </div>
                `;

            createStickyNote(stickyNoteTemplate,StickyNoteData);
    })
   }, [])

    
   useEffect(() => {
    localStorage.setItem("StickyNotes",JSON.stringify(StickyNotes));
   },[StickyNotes])
   
   /*
   Get the StickyNotes from Local Storage to be rendered
   */
   useEffect(() => {
        if(localStorage.getItem("StickyNotes")!==null) {
            setStickyNotes(JSON.parse(localStorage.getItem("StickyNotes")));
        }
   }, [])

    return (
        student!==null?
        <div>
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
                    </div>
                  </div>  
                  {
                  onProfileBtn &&    
                  <div className="Profile-box scrollbar-hidden">
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
                        /*
                        Upon logging out delete data from Local Storage.
                        */
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
                  let stickyNoteTemplate = `
                  <div class="header-Sticky-cont">
                      <div class="title" contenteditable="true" spellcheck="false">Title</div>
                      <div class="minimize"><i class="fas fa-window-minimize MinimizeIcon"></i></div>
                      <div class="remove"><i class="fa fa-times" aria-hidden="true"></i></div>
                  </div>
                  <div class="note-cont">
                      <textarea spellcheck="false" placeholder="Type Notes"></textarea>
                  </div>
                  `;
                  createStickyNote(stickyNoteTemplate);
              }}/></div>
              <div id="notify-Note-Opening">Note has opened <br />Please Drag and drop to have better experience..</div>
        </div>:
        <div>
          <div className="loader profile-info"></div>
        </div>
    )
}

export default StudentDashboard
