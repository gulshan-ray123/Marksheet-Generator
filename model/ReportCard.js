const mongoose = require('mongoose');
const RepUserInfo= mongoose.Schema({
    schoolName:{
        type: String,
        required: true
    },
    AffiliationBoard:{
        type: String,
        require: true
    },
    AffiliationNo:{
        type: Number,
        require: true,
    },
    Address:{
        type: String,
        require: true
    },
    Phone:{
        type: Number,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    Session:{
        type: String,
        require: true
    }
})
module.exports =mongoose.model('RepInfo', RepUserInfo);