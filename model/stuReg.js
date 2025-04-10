const mongoose= require('mongoose');

// Creating Schema

const studentSchema= mongoose.Schema({
    enrollement:{
        type: Number,
        required:true,
    },
    studentName:{
        type: String,
        required:true,
    },
    fatherName:{
        type: String,
        required:true,
    },
    motherName:{
        type: String,
        required:true,
    },
    DateofBirth:{
        type: String,
        required:true,
    },
    Address:{
        type: String,
        required:true,
    },
    Class_name:{
        type: String,
        required:true,
    },
    Roll:{
        type: Number,
        required:true,
    },
    HouseName:{
        type: String,
        required:true,
    },
    Image:{
        type:String,
        required:true,
    },
})

 module.exports =mongoose.model('stuInfo',studentSchema);