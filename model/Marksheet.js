const mongoose = require('mongoose');
const marksheetSchema= mongoose.Schema({
    Enrollement:{
        type: Number,
    },
    MaxTheory:{
        type: Number,
        require: true,
    },
    MaxPracticle:{
        type: Number,
        require: true,
    },
    Subject:{
        type: String,
        require: true,
    },
    Theory_term1:{
        type: Number,
    },
    Practicle_term1:{
        type: Number,
    },
    MarksObtained_term1:{
        type:Number,
        require: true,
    },
    Grade:{
        type:String,
        require: true,
    },
    Theory_term2:{
        type: Number,
    },
    Practicle_term2:{
        type: Number,
    },
    MarksObtained_term2:{
        type:Number,
        require: true,
    },
    Grade2:{
        type:String,
        require: true,
    },
    Date:{
        type:String,
    },
    Total_full:{
        type:Number,
    },
    Total_full:{
        type:Number,
    },
    Percentage:{
        type:Number,
    }
})

module.exports = mongoose.model('marksheet',marksheetSchema);