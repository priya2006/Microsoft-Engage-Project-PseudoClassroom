const mongoose=require('mongoose')

const Schema=mongoose.Schema;

const teacherSchema=new Schema({
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
},{
    timestamps:true,
}) ;

const Teacher = mongoose.model('Teacher',teacherSchema);
module.exports=Teacher;   