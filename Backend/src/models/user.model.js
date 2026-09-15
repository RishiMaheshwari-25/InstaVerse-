const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"User already exists with this email"],
        required:[true,"username is required"]
    },
    email:{
        type:String,
        unique:[true,"User already exists with this email"],
        required:[true,"email is required"]
    },
    password:{
        type:String,
        required:[true,"password is required"],
        select:false
    },
    bio:String,
    profileImage:{
        type:String,
        default:"https://ik.imagekit.io/ddymtszym/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette_719432-3519.avif"

    }

})
const userModel=mongoose.model("users",userSchema);
module.exports=userModel;