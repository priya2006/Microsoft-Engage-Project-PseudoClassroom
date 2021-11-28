const router= require('express').Router();
const Teacher= require('../models/TeacherModel');
const nodemailer=require('nodemailer')

//Posting the teacher details on DB
router.route('/').post((req,res)=>{
    const teacherEntry=req.body;
    const newEntry=new Teacher (teacherEntry);

    newEntry.save()
    .then(()=>res.json('Teacher added successfully!!'))
    .catch(err => res.status(400).json('Cannot enter Entry as' + err ));
});

/*
Fetching the Teacher details using email given in params.
*/
router.route('/:email').get((req,res)=>{
        const Email=req.params.email;   

        Teacher.find({email:Email})
        .then(teacher=>res.json(teacher))
        .catch(err => res.status(400).json('Error' + err))
  
})

/*
Updating the Teacher data using the email given in params.
*/
router.route('/:email').patch((req,res)=>{
    const Email=req.params.email;
    const data=req.body;
    console.log(data);
    // res.json(data);
    console.log(Email);

    Teacher.findOneAndUpdate({"email":Email}, data, {upsert: true})
    .then((res)=>res.json("Data Updated Successfully!!"))
    .catch(err=>res.status(500).json("Error" + err))
})


/*
Reseting the Password of the student by sending OTP to their
 mail given in body of request same as for student
*/
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
      pass: 'rvuyjgokgufdxwsh', // generated ethereal password
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


//Fetching teacher using the unique id.
router.route('/:id').get((req,res)=>{
    const id=req.params.id
    Teacher.findById(id)
    .then(teacher =>res.json(teacher))
    .catch(err => res.status(400).json('Something went wrong: '+err));
})








module.exports= router;
