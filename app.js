
const express = require('express')
const app = express();
const mongoose=require('mongoose')
const cors=require('cors');
const path = require('path');
const nodemailer=require('nodemailer');
const env=require('dotenv')


env.config();//configuring .env environment to access environmental variables in .env file

const port = process.env.PORT||4000;

app.use(cors());//for having access to request any server and get request from any server
app.use(express.json());//convert in json format
app.use(express.static(path.join(__dirname, 'cd Pseudo Classroom App/pseudoclassroom-app/build')));
//Taking the URl to connect  with my MongoDB's Cloud database 
const Uri=process.env.ATLAS_URI;

//Connecting with DB using mongoose 
mongoose.connect(Uri);

const database = mongoose.connection;
database.on("error", console.error.bind(console, "Database Connection error:"));
database.once("open",() =>{
  console.log("Database Connected successfully");
});

//Router fetches from their to for further 
const StudentRouter = require('./routes/StudentRoute')
const TeacherRouter = require('./routes/TeacherRoute')
const CourseRouter = require('./routes/CourseRoute')

//seeting the routes on which what route you would select
app.use('/student',StudentRouter)
app.use('/course', CourseRouter);
app.use('/teacher', TeacherRouter);

/* App is now listening on 4000*/
app.listen(port,()=>{
    console.log("Listening to Port ", port);
});