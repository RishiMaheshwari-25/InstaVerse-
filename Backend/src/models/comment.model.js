const mongoose=require("mongoose");

const commentSchema=new mongoose.Schema({
    post:{type:mongoose.Schema.Types.ObjectId,ref:"posts",required:true},
    user:{type:String,required:true},
    text:{type:String,required:true,trim:true,maxlength:300}
},{timestamps:true});

const commentModel=mongoose.model("comments",commentSchema);
module.exports=commentModel;
