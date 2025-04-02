const mongoose = require('mongoose');

// Creating Schema
const RegisterLogo= mongoose.Schema({
    AffNo:{
        type:'Number',
        require:true,
    },
 ImageId:{
    type:"string",
    require:true,
 }
});
module.exports=mongoose.model('RegisterLogo', RegisterLogo);