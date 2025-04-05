const mongoose = require('mongoose');
// Creating Schema
const RegisterAdmin= mongoose.Schema({
    username:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
    },
    Secret_Key:{
        type:Number,
        require:true,
    }
});

module.exports=mongoose.model('RegisterAdmin', RegisterAdmin);