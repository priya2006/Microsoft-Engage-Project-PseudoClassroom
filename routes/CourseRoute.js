const router =require('express').Router();//Taking Router 
const Course=require('../models/CourseModel');

// setting functionality to set routes

//Post course details 
router.route('/').post((req,res)=>{
    const courseEntry=req.body;
    const newEntry=new Course (courseEntry);

    newEntry.save()
    .then(()=>res.json('Course added successfully!!'))
    .catch(err => res.status(400).json('Cannot enter Entry as' + err ));
});

//get all the courses
router.route('/allCourses').get((req,res)=>{
    
    Course.find()
    .then(courses=>res.json(courses))
    .catch(err => res.status(400).json('Error' + err))
})

/*
get the course with specified id in params
*/
router.route('/:id').get((req,res)=>{
    const id=req.params.id;

    Course.findById(id)
    .then(course=>res.json(course))
    .catch(err => res.status(400).json('Error' + err))

})

/*
Update the course data whose id is what given in params 
*/
router.route('/:id').patch((req,res)=>{

    const id=req.params.id;
    const data=req.body;
    Course.findOneAndUpdate({"_id":id}, data, {upsert: true})
    .then(course=>res.send("Data Updated Successfully!!"))
    .catch(err=>res.status(500).json("Error" + err))

})

module.exports=router;