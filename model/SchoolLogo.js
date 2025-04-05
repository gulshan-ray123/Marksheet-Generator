const mongoose = require('mongoose');

// Creating Schema
const RegisterLogo= mongoose.Schema({
    AffNo:{
        type:Number,
        require:true,
    },
 ImageId:{
    type:String,
    require:true,
 }
});
module.exports=mongoose.model('RegisterLogo', RegisterLogo);