const mongoose= require('mongoose');
 const DisplininarySchema= mongoose.Schema({
    Enrollement:{
       type:Number,
       require: true,
    },
    Affiliation:{
        type:Number,
        require: true,
    },
    Dis_term1:{
        type:String,
    },
    Dis_term2:{
        type:String,
    },
    Teacher_Remarks:{
        type:String,
    },
    Promoted:{
        type:String,
    },
    Result_key:{
        type:Number,
        require:true,
    }
})
module.exports= mongoose.model('disciple',DisplininarySchema);