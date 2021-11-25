import React,{useState,useEffect} from 'react'
import axios from 'axios'

function PreferrenceEachDay(props) {
    const [isPreferrenceAskedbyTeacher,setisPreferrenceAskedbyTeacher]=useState(true);
    const [classFull,setClassFull]=useState(false);
    const [IsIn_Person,setOption]=useState(false);
    const [IsCriteriaGivenbyTeacher,setIsCriteriaGivenbyTeacher]=useState(true);
    const [IsAllowedAccordingtoConditions,setIsAllowedAccordingtoConditions]=useState(true);
    const [isPreferrenceApplicable,setisPreferrenceApplicable]=useState(true)
    const [IsAlreadyGiven,setIsAlreadyGiven]=useState(false);

    const day_Num=props.id;
    function submitPreferrence(e){
        e.preventDefault();
       
        let teacherPreferrence=props.course.teacherPreferrenceCriteria[day_Num];
        
        axios.get("http://localhost:4000/course/"+props.course._id)
        .then((res)=>{
            console.log(res);
            if(res.data){
                teacherPreferrence=res.data.teacherPreferrenceCriteria[day_Num];
            }
        })
        .catch((err)=>console.log(err));

        let Preferrence={};
        let chkAllowed=true;
        if(IsIn_Person){
            Preferrence["Option"]="In-Person";
            Preferrence["vaccination-status"]=document.querySelector('select').value;
            if(document.querySelector("input[value='yes']").checked)
            Preferrence["Parent's concern"]='yes';
            else
            Preferrence["Parent's concern"]='no';

            console.log(teacherPreferrence,Preferrence);
            if(Preferrence["vaccination-status"]==='Not'){
                setIsAllowedAccordingtoConditions(false);
                chkAllowed=false;
            }else{
                if(teacherPreferrence["vaccination-status"]==='Full'){
                    if(Preferrence["vaccination-status"]==='Partial'){
                        console.log("parieijfs");
                        setIsAllowedAccordingtoConditions(false);
                        chkAllowed=false;
                    }
                }
            }
            if(teacherPreferrence["Parent's concern"]==='yes'){
                if(Preferrence["Parent's concern"]==='no'){
                    setIsAllowedAccordingtoConditions(false);
                    chkAllowed=false;   
                }
            }
        }else{
            Preferrence["Option"]="Remote";
            setisPreferrenceAskedbyTeacher(true);
            setIsCriteriaGivenbyTeacher(true);
            setisPreferrenceApplicable(false);
        }

        if(!chkAllowed){
            Preferrence={"Option":"Remote"};
            console.log(Preferrence);
            setisPreferrenceAskedbyTeacher(true);
            setIsCriteriaGivenbyTeacher(true);
            setisPreferrenceApplicable(false);
        }else{
            setTimeout(() => {
                setIsAlreadyGiven(true);
            }, 1000);
            setIsCriteriaGivenbyTeacher(true);
            setisPreferrenceAskedbyTeacher(true);
            setisPreferrenceApplicable(false);
        }

        const WeeklyPreferrences=props.course.WeeklyPreferrences;
        WeeklyPreferrences[day_Num][props.studentId]=Preferrence;

        axios.patch("http://localhost:4000/course/"+props.course._id,{"WeeklyPreferrences": WeeklyPreferrences})
        .then((res)=>console.log("Preferrence added successfully",res))
        .catch((err)=>console.log(err));
        
        alert("Criteria sent for "+props.day + " Class");   
        // if(chkAllowed)
        // setIsAlreadyGiven(true);
    }
    
    

    function countNumberofStudents(PreferrencesPermitted){
        let countNumber=0;
        for (const [key, value] of Object.entries(PreferrencesPermitted)) {
            if(value["Option"]==="In-Person")   
            countNumber++;
        }
        return countNumber;
    }
    
    function CheckAndSetIfAlreadyPresentPreferrence(Currcourse){
        const isPresentPreferrence=Object.keys(Currcourse.WeeklyPreferrences[day_Num][props.studentId]).length>0;
        if(isPresentPreferrence){
            console.log("present");
            setIsAlreadyGiven(true);
            setisPreferrenceAskedbyTeacher(true);
            setIsCriteriaGivenbyTeacher(true);
            setisPreferrenceApplicable(false);
            setIsAllowedAccordingtoConditions(true);
            // const PrevPreferrence=Currcourse.WeeklyPreferrences[day_Num][props.studentId];
            // if(PrevPreferrence["Option"]==='Remote'){
            //     document.getElementById('Remote').checked=true;
            // }else{
            //     document.getElementById('In-Person').checked=true;
            //     setOption(true);
            //     setClassFull(false);
            //     const Vaccine_status=PrevPreferrence["vaccination-status"];
            //     document.getElementById(Vaccine_status).selected=true;
            //     const concern=PrevPreferrence["Parent's concern"];
            //     document.getElementById(concern).checked=true;
            // }
            // document.getElementById('submit').value='Edit';
        }
    }

    function checkTeacherPreferrence(){
        axios.get("http://localhost:4000/course/"+props.course._id)
        .then((res)=>{
            if(res.data){
                console.log(res.data);
                const Currcourse=res.data;
                // console.log(Object.keys(Currcourse.teacherPreferrenceCriteria[props.id]).length);
                if(Object.keys(Currcourse.teacherPreferrenceCriteria[day_Num]).length){

                    if(Currcourse.teacherPreferrenceCriteria[day_Num]["Option"]==='Remote'){
                    setisPreferrenceAskedbyTeacher(false);
                    setisPreferrenceApplicable(false);
                    }
                    
                    console.log(Currcourse,isPreferrenceAskedbyTeacher);
                    let PercentageOfStudents=parseInt(Currcourse.teacherPreferrenceCriteria[day_Num]["%ofstudents"]);
                    let numberOfStudentsAllowedIn_Person=Math.ceil((Currcourse.Enrolledstudents.length * PercentageOfStudents)/100);
                    let NumberofStudentsPermitted=countNumberofStudents(Currcourse.WeeklyPreferrences[day_Num]);
                    if(numberOfStudentsAllowedIn_Person===NumberofStudentsPermitted){
                    setClassFull(true);
                    }

                }else{
                    setIsCriteriaGivenbyTeacher(false);
                    setisPreferrenceApplicable(false);
                }
                CheckAndSetIfAlreadyPresentPreferrence(Currcourse);
            }
        })
        .catch((err)=>{
            console.log(err);
        })
        
    }
    useEffect(() => {
        checkTeacherPreferrence();
    },[])

    return (
        <div className="PreferrenceForEachClass">
        {
          !isPreferrenceAskedbyTeacher&&
          <fieldset className="day-preferrence">
          <legend align="left">{props.day} Class</legend>
          <pre className="NoPreferrenceMessage">
            Sorry, for this day your teacher has asked to attend the class remotely only. <br />
            So, no Preferrence needed!!
          </pre>
          </fieldset>
        }
        {
            !IsCriteriaGivenbyTeacher&&
            <fieldset className="day-preferrence">
          <legend align="left">{props.day} Class</legend>
          <pre className="NoPreferrenceMessage">
            Your teacher have not given any criteria yet. we will get back to you when your
            <br />teacher adds the criteria.Thank you your patience!
          </pre>
          </fieldset>
        } 
        {
            isPreferrenceApplicable&&
          <form onSubmit={submitPreferrence}>
              <fieldset className="day-preferrence">
                  <legend align="left">{props.day} Class</legend>
                  <div Style="font-size:1.2rem;color:#657688;height:1rem;">What mode do you prefer for Day class?</div>
                  <div className="details">
                      <div className='in-person'>
                          <input type="radio" value="In-Person" id="In-Person"  name="Option" required onChange={()=>{
                              setOption(true);
                              if(classFull)
                              document.querySelector("input[name='Option']").disabled=true;
                              }}/>In-Person
                      </div>
                      <div className="remote">
                          <input type="radio" value="Remote" id="Remote" name="Option" required onChange={()=>{setOption(false)}}/>Remote
                      </div>
                  </div>
                  { 
                  IsIn_Person&&classFull&&   
                    <pre Style="font-size:0.8rem; color: rgb(218, 90, 90);;">
                        Sorry, no more seats available for In-person.<br />
                        Please attend the class remotely:( 
                    </pre>
                 }
                 {
                   IsIn_Person&&(!classFull)&& 
                   <div className='DetailsForInperson'>
                      <div Style="font-size:1.2rem;color:#657688;height:1rem;">Please, provide the following information also !</div>
                      <div className="extra-details">
                          <div className="vaccination-status"> 
                              <div>Vaccination-status :</div> 
                              <div >
                                  <select className="vaccination-status-select" required>
                                      <option id="none" value="none" >Select status:</option>
                                      <option id="Full" value="Full">Full Vaccinated</option>
                                      <option id="Partial" value="Partial">Partial Vaccinated</option>
                                      <option value="Not" id="Not">Not Vaccinated</option>
                                  </select>
                              </div>  
                              </div>
                          <div className="parent-concern">
                              <div>Parent's Concern:</div>
                              <div className="concern-option">
                                  <div>
                                      <input type="radio" value="yes" id="yes" required name="concern" />Yes
                                  </div>
                                  <div>
                                      <input type="radio" value="no" id="no" required   name="concern" />No
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div> 
                  }
                  <div ><input type="submit"  id='submit' className="send-preferrence" value="Send" /></div>
              </fieldset>
          </form>
          }
          {
              !IsAllowedAccordingtoConditions&&
              <fieldset className="day-preferrence">
              <legend align="left">{props.day} Class</legend>
              <pre className="NoPreferrenceMessage">
               Sorry, you are not allowed to take the In-Person as you didn't fulfill the criteria given 
               <br/>by your teacher. Try again next week by following proper guidelines. 
              </pre>
              </fieldset>
          }
           {
              IsAlreadyGiven&&
              <fieldset className="day-preferrence">
              <legend align="left">{props.day} Class</legend>
              <pre className="NoPreferrenceMessage">
                  You have already submitted!!. Thanks:)    
              </pre>
              </fieldset>
          }
          </div>
         
    )
}

export default PreferrenceEachDay
