const mongoose = require('mongoose');
const RepUserInfo= mongoose.Schema({
    schoolName:{
        type: 'string',
        required: true
    },
    AffiliationBoard:{
        type: 'string',
        require: true
    },
    AffiliationNo:{
        type: 'Number',
        require: true,
    },
    Address:{
        type: 'string',
        require: true
    },
    Phone:{
        type: 'number',
        require: true
    },
    email:{
        type: 'string',
        require: true
    },
    Session:{
        type: 'string',
        require: true
    }
})
module.exports =mongoose.model('RepInfo', RepUserInfo);