import React,{useState,useEffect} from 'react'
import "../Css/TeacherDashboard.css"
import axios from 'axios'//to fetch data or post data in DB or basically to communicate with DB.

//This is for taking each day's Criteria from the teacher so it is rendered from TeacherCourse.js 


function CriteriaEachDay(props) {
    const [IsIn_Person,setOption]=useState(false);//Check whether In-Person is selected or not
    const [IsAlreadyGiven,setIsAlreadyGiven]=useState(false);//Check whether criteria is already given or not
     
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
    //in the starting check whether Criteria  is already given or not 
    useEffect(() => {
        const prevteacherPreferrenceCriteria=props.course.teacherPreferrenceCriteria[props.id];
        if(Object.keys(prevteacherPreferrenceCriteria).length>0){
            setIsAlreadyGiven(true);
        }
    })

    return (
        <div className="CriteriaForEachClass">
        {
            //If already submitted then show this else the whole form to submit.
                IsAlreadyGiven?
                <fieldset className="day-preferrence">
                <legend align="left">{props.day} Class</legend>
                <pre className="NoPreferrenceMessage">
                    You have already submitted!!. Thanks:)    
                </pre>
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
