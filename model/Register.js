const mongoose = require('mongoose');
const dotenv=require('dotenv');
dotenv.config();
const db=process.env.DATABASE_URL;
mongoose.connect(db);
// Creating Schema
const RegisterUser= mongoose.Schema({
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
    }
});

module.exports=mongoose.model('RegisterUser', RegisterUser);