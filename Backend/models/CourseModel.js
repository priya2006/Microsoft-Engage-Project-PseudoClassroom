const mongoose=require('mongoose')

const Schema=mongoose.Schema;

const courseSchema=new Schema({
    courseId:{
        type:String,
        unique:true,
    },
   teacherId:{
       type:String,
   },
   Enrolledstudents :{
       type:Array,
   },
   Weekdays :{
       type:Array,
   },
   WeeklyPreferrences:{
       type:Array,
   },
   teacherPreferrenceCriteria:{
       type:Array,
   }
},{
    timestamps:true,
}) 

const Course = mongoose.model('Course',courseSchema);
module.exports=Course;