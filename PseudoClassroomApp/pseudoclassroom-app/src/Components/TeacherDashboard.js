import React,{useState} from 'react'
import Header from "./Header";
import Footer from "./Footer";
import Profile from './Profile';
import WhiteBoard from './WhiteBoard';
import Settings from './Settings';
import TeacherCourse from './TeacherCourse';
import FAQ from './FAQ';
import "../Css/TeacherDashboard.css";

/*
This is the Dashboard for the Teacher to display functionalities of the teacher, courses and also a WhiteBoard so that teacher can teach students
*/

function TeacherDashboard(props) {
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
    State to handle Settings window to change the password
    */
    const [IsSettings,setIsSettings]=useState(false);
    /*
    State to handle WhiteBoard window to use it.
    */
    const [IsWhiteBoard,setIsWhiteBoard]=useState(false);
    /*
    State to handle FAQ window to answer some frequently asked quesitons
    */
    const [IsFAQ,setIsFAQ]=useState(false);

    //Take the teacher details from the props
    const teacher=props.teacher;
    
    return (
        teacher!==null?
        <div>
              <div className="Profile-cont">
                  <div className="Profile-name-btn">
                    <div className="Profile-name">
                        <h3>Hello, {teacher.firstName}!</h3>
                    </div>    
                    <div className="Profile-btn" onClick={()=>{
                        
                        setonProfilebtn(!onProfileBtn)
                        setIsProfile(false);
                        setIsSettings(false);
                        setIsFAQ(false);

                    }}>
                    {teacher.firstName[0]+teacher.lastName[0]}
                    </div>
                  </div>  
                  {
                  onProfileBtn &&    
                  <div className="Profile-box scrollbar-hidden">
                     <h2>{props.teacher.firstName+' '+props.teacher.lastName}<br /><p Style="font-size:1rem;">Teacher</p><hr /></h2> 
                     <div onClick={()=>{
                         
                            if(IsSettings)setIsSettings(false);
                            if(IsFAQ)setIsFAQ(false);

                            setIsProfile(!IsProfile)

                        }}><i class="fa fa-user" aria-hidden="true"></i>Profile</div>
                    
                     <div onClick={()=>{

                            if(IsProfile)setIsProfile(false);
                            if(IsFAQ)setIsFAQ(false);

                            setIsSettings(!IsSettings)

                         }}><i class="fas fa-cog" ></i>Settings</div>
                     <div onClick={()=>{

                            if(IsProfile)setIsProfile(false);
                            if(IsSettings)setIsSettings(false);

                            setIsFAQ(!IsFAQ)
                            
                         }}><i class="fas fa-question"></i>FAQ</div>
                     <div onClick={()=>{

                        localStorage.removeItem("User");
                        localStorage.removeItem("type");
                        window.history.back();

                     }}><i class="fas fa-sign-out-alt"></i>Log out</div>
                  </div>
                  }
                  {
                      IsProfile&&
                        <Profile setIsProfilebyProp={()=>{setIsProfile(!IsProfile)} } type="Teacher" email={teacher.email}/> 
                  }
                 
                  {
                      IsSettings&&
                        <Settings setIsSettingsbyProp={()=>setIsSettings(!IsSettings)} user={teacher} type="teacher" email={teacher.email} />
                  }
                
                  {
                      IsFAQ&&
                        <FAQ setIsFAQ={()=>setIsFAQ(!IsFAQ)} />
                  }
              </div>
              
                <div className="Courses-cont scrollbar-hidden">
                    {
                        teacher.courses.length>0&&
                        teacher.courses.map((course,idx) => {
                            return <TeacherCourse courseId={course} key={idx} />
                        })
                    }
                </div>
                <div onClick={()=>setIsWhiteBoard(!IsWhiteBoard)} className="board" title="White Board"><i class="far fa-edit"></i></div>
                {
                IsWhiteBoard&&
                    <WhiteBoard  setIsWhiteBoardbyProp={()=>{setIsWhiteBoard(!IsWhiteBoard)} }/>
                }
        </div>:
         <div>
            <h2>Something went wrong, Please try again later!!!</h2>
        </div>
       
    )
}

export default TeacherDashboard
