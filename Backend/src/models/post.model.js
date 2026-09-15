const mongoose=require("mongoose");
const postSchema=new mongoose.Schema({
    caption:{
        type:String,
        default:""
    },
    img_url:{
        type:String,
        required:[true,"imgUrl is required to create post"]
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:[true,"User id is required for creating post"]
    }
    
})
const postModel=mongoose.model("post",postSchema)
module.exports=postModel;