import React,{useState,useEffect} from 'react'
import "../Css/TeacherDashboard.css"
import axios from 'axios'//to fetch data or post data in DB or basically to communicate with DB.

//This is for taking each day's Criteria from the teacher so it is rendered from TeacherCourse.js 


function CriteriaEachDay(props) {

    //Check whether In-Person is selected or not
    const [IsIn_Person,setOption]=useState(false);

    //Check whether criteria is already given or not
    const [IsAlreadyGiven,setIsAlreadyGiven]=useState(false);

    //Store the Students attending class Remotely after teacher has set the Criteria 
    const [RemoteStudents,setRemoteStudents]=useState([]);

    //Store the Students attending class In-Person after teacher has set the Criteria
    const [InPersonStudents,setInPersonStudents]=useState([]);

    //Check after criteria is set whether class is Remote or In-Person;
    const [IsclassRemote,setIsclassRemote]=useState(false);
     
    function submitCriteria(e){
        e.preventDefault();
        let Criteria={};
        //maintain criteria given by teacher in the object
        if(IsIn_Person){
            Criteria["Option"]="In-Person";
            Criteria["vaccination-status"]=document.querySelector('select').value;
            Criteria["Parent's concern"]=document.querySelector("input[name='concern']").value;
            Criteria["%ofstudents"]=document.querySelector("input[name='%OfStudents']").value;
        }else{
            Criteria["Option"]="Remote";
        }

        let prevteacherPreferrenceCriteria=[];

        //Update the criteria for the class of this day 
        axios.get("http://localhost:4000/course/"+props.course._id)
        .then((res)=>{
            console.log(res);
            if(res.data){
                prevteacherPreferrenceCriteria=res.data.teacherPreferrenceCriteria;
                prevteacherPreferrenceCriteria[props.id]=Criteria;

                axios.patch("http://localhost:4000/course/"+props.course._id,{"teacherPreferrenceCriteria":prevteacherPreferrenceCriteria})
                .then((res)=>console.log(res))
                .catch((err)=>console.log(err))
             setIsAlreadyGiven(true);
            }
        })
        .catch((err)=>{
            console.log(err);
        })

        alert("Criteria sent for "+ props.day + " Class");
    }
    
    /*
    function to fetch student's name using email.
    */
    async function getNameOfStudent(email){
        let Name=""
       await axios.get("http://localhost:4000/student/"+email)
        .then((res)=>{
            if(res.data.length){
                // console.log(res.data)
                Name=res.data[0]["firstName"]+" "+res.data[0]["lastName"];
            }
        })
        .catch((err)=>console.log(err))

        return Name;
    }
    
    /*
    Function to fetch students of two diff category remote or in-person
    */
    async function getStudents(){

        document.querySelector("body").style.cursor="wait";
        
        setTimeout(() => {
            document.querySelector("body").style.cursor="default";
        }, 4000);

        
        /*
        Fetching all the Preferrences and then checking who is 
        attending remotely and who is In-Person
        */
        const AllPreferrences=props.course.WeeklyPreferrences[props.id];

        for(const Studentemail in AllPreferrences){
            const Preferrence=AllPreferrences[Studentemail];
            let StudentName;

            //fetching the Student name using their EmailId from the DB.
            await getNameOfStudent(Studentemail)
            .then((res)=>{
                StudentName=res;
            })
            .catch((err)=>console.log(err));

            /*
            Adding in RemoteStudents if student is attending remotely else in InPerson.
            */
            if(Preferrence["Option"]==="Remote"){
                const CurrStudents=RemoteStudents;
                if(!CurrStudents.find((name)=>{return name===StudentName})){
                    CurrStudents.push(StudentName);
                    setRemoteStudents(CurrStudents);
                }
            }else if(Preferrence["Option"]==="In-Person"){
                const CurrStudents=InPersonStudents;
                if(!CurrStudents.find((name)=>{return name===StudentName})){
                    CurrStudents.push(StudentName);
                    setInPersonStudents(CurrStudents);
                }
            }
        }
       
    }


    //in the starting check whether Criteria  is already given or not 
    useEffect(() => {
        const prevteacherPreferrenceCriteria=props.course.teacherPreferrenceCriteria[props.id];
        if(Object.keys(prevteacherPreferrenceCriteria).length>0){
            setIsAlreadyGiven(true);

            //Marking whether class is remote or not
            if(prevteacherPreferrenceCriteria["Option"]==="Remote")
            setIsclassRemote(true);

            //get the students is class is not remote.
            else
            getStudents();
        }
    },[])

    return (
        <div className="CriteriaForEachClass">
        {
            //If already submitted then show this else the whole form to submit.
                IsAlreadyGiven?
                <fieldset className="day-preferrence">
                <legend align="left">{props.day} Class</legend>
                {
                    //Class is not remote then only show list 
                  !IsclassRemote?
                <pre className="NoPreferrenceMessage" Style="color:#656a72;">
                    List of Students attending the Class In-Person or Remotely. 
                </pre>:
                <pre className="NoPreferrenceMessage">
                    You have said to take the class Remotely so all the students <br /> would be attending the class remotely only!
                </pre>
                }
                {
                //Display the table contains students attending remotely and in-person
                    !IsclassRemote&&
                <div  className="Students-record">    
                    <table border="1" cellpadding="3" width="80%" height="100%">
                        <tbody>
                            <tr>
                            <th>Remote</th>
                            <th>In-Person</th>
                            </tr>
                            <tr>
                            <td>
                                <ul>    
                            {
                                RemoteStudents.map((studentName,index) => {
                                    return <li key={index}>{studentName}</li>;
                                })
                                
                            }
                                </ul>
                            </td>
                            <td>
                                <ul>    
                            {
                                InPersonStudents.map((studentName,index) => {
                                    return <li key={index}>{studentName}</li>;
                                })
                            }
                                </ul>
                            </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                }
                </fieldset>:
            <form onSubmit={submitCriteria}>
            <fieldset className="day-criteria">
                <legend align="left">{props.day} Class</legend>
                <div Style="font-size:1.2rem;color:#657688;height:1rem;">What mode do you prefer for Day class?</div>
                <div className="details">
                    <div className='in-person'>
                        <input type="radio" value="In-Person" className="In-Person" name="Option" onChange={()=>setOption(true)} />In-Person
                    </div>
                    <div className="remote">
                        <input type="radio" value="Remote" className="Remote" name="Option" onChange={()=>setOption(false)}/>Remote
                    </div>
                </div>
                { 
                IsIn_Person&&
                 <div className='DetailsForInperson'>
                    <div Style="font-size:1.2rem;color:#657688;height:1rem;">Please, provide the following Criteria also !</div>
                    <div className="extra-details">
                        <div className="vaccination-status"> 
                            <div>Vaccination-status :</div> 
                            <div >
                                <select className="vaccination-status-select" name="Vaccination-status">
                                    <option className='none' value="none" >Select status:</option>
                                    <option className='Full' value="Full">Full Vaccinated</option>
                                    <option className='Partial' value="Partial">Partial Vaccinated</option>
                                </select>
                            </div>  
                            </div>
                        <div className="parent-concern">
                            <div>Parent's Concern:</div>
                            <div className="concern-option">
                                <div>
                                    <input type="radio" value="yes" className="yes" name="concern" />Yes
                                </div>
                                <div>
                                    <input type="radio" value="no" className="no" name="concern" />No
                                </div>
                            </div>
                        </div>
                        <div className="PercentageOfStudents">
                            <div>% of Students you want in class:  </div>
                            <div className="input_percentage">
                               <input type="number" className='NumStudents'  min="1" max="100" name="%OfStudents" />
                            </div>
                        </div>
                    </div>
                </div> 
                }
                <div ><input type="submit" className="send-criteria submit" value="Send" /></div>
            </fieldset>
        </form>
        }
        </div>
    )
}

export default CriteriaEachDay
