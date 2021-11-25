const router =require('express').Router();
const Student = require('../models/StudentModel')
const  nodemailer=require('nodemailer');
const axios=require('axios')

// console.log("oiuyfg");

router.route('/').post((req,res)=>{
    const studentEntry=req.body;
    const newEntry=new Student (studentEntry);
    //  console.log(studentEntry);
    newEntry.save()
    .then(()=>res.json('Student added successfully!!'))
    .catch((err) => res.status(400).json('Cannot enter Entry as' + err ));
})

router.route('/').get((req,res)=>{
    Student.find()
    .then(students => res.json(students))
    .catch(err => res.status(400).json('Error'+err))
})
router.route('/:email').get((req,res)=>{
    const Email=req.params.email;
// console.log(req.params);
    Student.find({email:Email})
    .then(student=>res.json(student))
    .catch(err => res.status(400).json('Error' + err))
})


router.route('/resetPassOTP').post(async(req,res)=>{
    const email=req.body.email;
    const OTP=Math.floor(Math.random() * (9999 -1000) + 1000);
    try{
    const transport=nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user:" classscheduler.engageproject@gmail.com", // generated ethereal user
      pass: 'nmdebziiuzeawshv', // generated ethereal password
    },
   }) 
    await transport.sendMail({
       from:'classscheduler.engageproject@gmail.com',
       to:email,
       subject: "OTP for email verification for password reset",
       html:`<div>
       Hello ${req.body.firstName},
       <pre><b>Sorry to hear that you forget the password but don't worry we are here to help you to get through it just use this 4-digit OTP <i Style="color:red"><u>${OTP}</u></i> for the moving forward with the password reset process.</b></pre>
       Thanks,<br /> Class Scheduler
       </div>
       `
   })
   res.json(OTP.toString());
   }
   catch(err){
       console.log(err);
   }
})


router.route('/:email').patch((req,res)=>{
    const Email=req.params.email;
    const data=req.body;
    console.log(data);
    // res.json(data);
    console.log(Email);

    Student.findOneAndUpdate({"email":Email}, data, {upsert: true})
    .then((res)=>{console.log(res)})
    .catch(err=>res.status(500).json("Error" + err))
})

router.route('/:id').get((req,res)=>{
    const id=req.params.id

    Student.findById(id)
    .then(student=>res.json(student))
    .catch(err => res.status(400).json('Error' + err))
})



module.exports=router;

/**
 {
    "firstName":"Priyanshi",
    "lastName":"Gupta",
    "email":"erfds@gmail.com",
    "password":"23442123",
    "courses":[],
    "notifications":{}
}
 */