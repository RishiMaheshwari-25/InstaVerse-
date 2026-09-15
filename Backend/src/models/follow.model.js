const mongoose=require("mongoose");
const followSchema=new mongoose.Schema({
    follower:{
       type:String,
        
    },
    followee:{
       type:String,
        
    },
    status:{
        type:String,
        default:"pending",
        enum:{
            values:["pending","accepted","rejected"],
            message:"status can only be pending,accepted,rejected"
        }
    }
},{
    timestamps:true
})
followSchema.index({follower:1,followee:1},{unique:true})
const followModel=mongoose.model("follows",followSchema);
module.exports=followModel;