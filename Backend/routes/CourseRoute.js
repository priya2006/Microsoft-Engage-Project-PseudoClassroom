const router =require('express').Router();
const Course=require('../models/CourseModel');


router.route('/').post((req,res)=>{
    const courseEntry=req.body;
    const newEntry=new Course (courseEntry);

    newEntry.save()
    .then(()=>res.json('Course added successfully!!'))
    .catch(err => res.status(400).json('Cannot enter Entry as' + err ));
});

router.route('/').get((req,res)=>{
    
    Course.find()
    .then(courses=>res.json(courses))
    .catch(err => res.status(400).json('Error' + err))
})


router.route('/:id').get((req,res)=>{
    const id=req.params.id;
    // const 
    
    Course.findById(id)
    .then(course=>res.json(course))
    .catch(err => res.status(400).json('Error' + err))
})

router.route('/:id').patch((req,res)=>{
    const id=req.params.id;
    const data=req.body;
    console.log(data);
    // res.json(data);
    Course.findOneAndUpdate({"_id":id}, data, {upsert: true})
    .then(course=>res.send("Data Updated Successfully!!"))
    .catch(err=>res.status(500).json("Error" + err))

})





















module.exports=router;