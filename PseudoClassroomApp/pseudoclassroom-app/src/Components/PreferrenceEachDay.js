import React,{useState,useEffect} from 'react'
import axios from 'axios'

/*
This is the component to take the prefereence from the students for each day's class of the course
Hence,it is rendered from StudentCourse.js 
*/

function PreferrenceEachDay(props) {

    //State are being handled here

    /*
    Check whether Teacher asked for preferrence which means if he/she set criteria for Remote class. 
    Hence no preference is asked from student in that case.
    */
    const [isPreferrenceAskedbyTeacher,setisPreferrenceAskedbyTeacher]=useState(true);
  
    /*
    check whether class is Full or not for inPerson classes according to Criteria set by the teacher.     
    */
    const [classFull,setClassFull]=useState(false);
   
    /*
    check if student select In person option or not 
    */
    const [IsIn_Person,setOption]=useState(false);

    /*
    Check is Criteria is  given by the teacher or not. If not, then can not take preferrence  from the students at this moment. 
    */
    const [IsCriteriaGivenbyTeacher,setIsCriteriaGivenbyTeacher]=useState(true);

    /*
    Check if student has selected InPerson option for this class then if he/she satisfy the conditions or not setted by the teacher.
    */
    const [IsAllowedAccordingtoConditions,setIsAllowedAccordingtoConditions]=useState(true);

    /*
    Check if Preferrence to be ask from the student or not
    */
    const [isPreferrenceApplicable,setisPreferrenceApplicable]=useState(true)

    /*
    Check if preferrence is already given or not.
    */
    const [IsAlreadyGiven,setIsAlreadyGiven]=useState(false);

    const day_Num=props.id;//store the day of the week whose preferrence is being asked

    //Check conditions with teacher criteria after submitting the preferrence if student satisfy or not

    function submitPreferrence(e){
        e.preventDefault();
        
        //Store teacher preferrence criteria
        let teacherPreferrence=props.course.teacherPreferrenceCriteria[day_Num];
        
        //fetch the curr teacher Preferrence from the DB.
        axios.get("/course/"+props.course._id)
        .then((res)=>{
            console.log(res);
            if(res.data){
                teacherPreferrence=res.data.teacherPreferrenceCriteria[day_Num];
            }
        })
        .catch((err)=>console.log(err));

        //Maintain the student Preferrence 

        let Preferrence={};
        let chkAllowed=true;//mark if student allowed according to the criteria set by the teacher 

        /*
        IF in Person is requested  by the student then take the information given by the student and 
        then check it with teacher's criteria to whether allowed or not
        */

        if(IsIn_Person){
            Preferrence["Option"]="In-Person";
            Preferrence["vaccination-status"]=document.querySelector('select').value;
            if(document.querySelector("input[value='yes']").checked)
            Preferrence["Parent's concern"]='yes';
            else
            Preferrence["Parent's concern"]='no';

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

        //If not allowed the show the student that he/she can attend the class remotely only

        if(!chkAllowed){
            Preferrence={"Option":"Remote"};
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

        //Now at the end update the pereferrence in the DB according the conditions and preferrence given by the student.

        const WeeklyPreferrences=props.course.WeeklyPreferrences;
        WeeklyPreferrences[day_Num][props.studentId]=Preferrence;

        axios.patch("/course/"+props.course._id,{"WeeklyPreferrences": WeeklyPreferrences})
        .then((res)=>console.log("Preferrence added successfully",res))
        .catch((err)=>console.log(err));
        
        alert("Criteria sent for "+props.day + " Class");   
    
    }
    
    /*
        Count the number of the students are allowed at this moment for the In person
        to check the %of student set by teacher to attend in Person class.
    */

    function countNumberofStudents(PreferrencesPermitted){
        let countNumber=0;
        for (const [, value] of Object.entries(PreferrencesPermitted)) {
            if(value["Option"]==="In-Person")   
            countNumber++;
        }
        return countNumber;
    }
    
    /*
    Check if Preferrence is already given by student and then show the  
    submitted msg to the students.
    */
    function CheckAndSetIfAlreadyPresentPreferrence(Currcourse){
        const isPresentPreferrence=Object.keys(Currcourse.WeeklyPreferrences[day_Num][props.studentId]).length>0;
        if(isPresentPreferrence){
            console.log("present");
            setIsAlreadyGiven(true);
            setisPreferrenceAskedbyTeacher(true);
            setIsCriteriaGivenbyTeacher(true);
            setisPreferrenceApplicable(false);
            setIsAllowedAccordingtoConditions(true);
        }
    }

    /*
    Fetch Teacher's criteria and set states according to conditions.
    */
    function checkTeacherPreferrence(){
        axios.get("/course/"+props.course._id)
        .then((res)=>{
            if(res.data){
                console.log(res.data);
                const Currcourse=res.data;
                if(Object.keys(Currcourse.teacherPreferrenceCriteria[day_Num]).length){

                    if(Currcourse.teacherPreferrenceCriteria[day_Num]["Option"]==='Remote'){
                    setisPreferrenceAskedbyTeacher(false);
                    setisPreferrenceApplicable(false);
                    }
                    
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

    //The teacher criteria is checked int he starting or the first time when the component mounts.
    useEffect(() => {
        checkTeacherPreferrence();
    },[])

    return (
        <div className="PreferrenceForEachClass">
        {
            //If pereferrence is not asked by the teacher.

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
            //If criteria is not set by the teacher for this day till now.

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
            //If Preferrence is to be asked from the students then show him/her the form to fill preferrence.

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
                  /*
                  If inperson is selected by the student but the class is full then show this to students
                  */
                  IsIn_Person&&classFull&&   
                    <pre Style="font-size:0.8rem; color: rgb(218, 90, 90);;">
                        Sorry, no more seats available for In-person.<br />
                        Please attend the class remotely:( 
                    </pre>
                 }
                 {
                   /*
                   If inperson is selected by the student but class is not full so show him/her the information form required.  
                   */
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
              /*
              If student is not allowed to take in person(if selected) according to the conditiions set by
               the teacher and preferrence given by student.
              */
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
               //If student already given the preferrence 
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
