const mongoose= require('mongoose');

// Creating Schema

const studentSchema= mongoose.Schema({
    enrollement:{
        type: 'number',
        require:true,
    },
    studentName:{
        type: 'string',
        require:true,
    },
    fatherName:{
        type: 'string',
        require:true,
    },
    motherName:{
        type: 'string',
        require:true,
    },
    DateofBirth:{
        type: 'string',
        require:true,
    },
    Address:{
        type: 'string',
        require:true,
    },
    Class_name:{
        type: 'string',
        require:true,
    },
    Roll:{
        type: 'number',
        require:true,
    },
    HouseName:{
        type: 'string',
        require:true,
    },
    Image:{
        type:'string',
        require:true,
    },
})

 module.exports =mongoose.model('stuInfo',studentSchema);