const mongoose=require('mongoose')

const Schema=mongoose.Schema;

const studentSchema=new Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:false,
        trim:true,
    },
    email:{
        unique:true,
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minlength:8,
    },
    courses:{
        type:Array,
    },
    notifications :{
        type:Object,
    },
    StickyNotes :{
        type:Array,
    }
},{
    timestamps:true,
}) 

const Student = mongoose.model('Student',studentSchema);
module.exports=Student;