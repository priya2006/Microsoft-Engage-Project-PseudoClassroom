
const express = require('express')
const app = express();
const mongoose=require('mongoose')
const cors=require('cors');
const nodemailer=require('nodemailer');
const env=require('dotenv')


env.config();//configuring .env environment to access environmental variables in .env file

const port = process.env.PORT||4000;

app.use(cors());//for having access to request any server and get request from any server
app.use(express.json());//convert in json format


const Uri=process.env.ATLAS_URI;
mongoose.connect(Uri);
const database = mongoose.connection;
database.on("error", console.error.bind(console, "Database Connection error:"));
database.once("open",() =>{
  console.log("Database Connected successfully");
});



const StudentRouter = require('./routes/StudentRoute')
const TeacherRouter = require('./routes/TeacherRoute')
const CourseRouter = require('./routes/CourseRoute')

app.use('/student',StudentRouter)
app.use('/course', CourseRouter);
app.use('/teacher', TeacherRouter);
// app.use('/',CourseRouter);

app.listen(port,()=>{
    console.log("Listening to Port ", port);
});