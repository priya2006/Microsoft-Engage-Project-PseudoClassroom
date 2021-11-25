import React,{useState,useEffect} from 'react'
import Header from "./Header";
import Footer from "./Footer";
import Profile from './Profile';
import Notifications from './Notifications';
import WhiteBoard from './WhiteBoard';
import Settings from './Settings';
import TeacherCourse from './TeacherCourse';
import FAQ from './FAQ';
import "../Css/TeacherDashboard.css";


function TeacherDashboard(props) {
    const [onProfileBtn,setonProfilebtn]=useState(false);
    const [IsProfile,setIsProfile]=useState(false);
    const [IsSettings,setIsSettings]=useState(false);
    const [IsWhiteBoard,setIsWhiteBoard]=useState(false);
    const [IsFAQ,setIsFAQ]=useState(false);
    const teacher=props.teacher;
    console.log(props,props.teacher);


    return (
        teacher!==null?
        <div>
            <Header />
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
                  <div className="Profile-box">
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
                        const type=localStorage.getItem("type");
                         localStorage.removeItem("User");
                         localStorage.removeItem("type");
                        //  window.location("/"+type);
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
            <Footer />
        </div>:
         <div>
            <Header/>
            <h2>Something went wrong, Please try again later!!!</h2>
            <Footer/>
        </div>
       
    )
}

export default TeacherDashboard
