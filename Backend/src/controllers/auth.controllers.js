const userModel = require("../models/user.model");

const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken");
async function registerController(req,res){
    const{email,password,username,bio,profileImage}=req.body;
    const isUserAlreadyExists=await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    if(isUserAlreadyExists){
        return res.status(409).json({
            message:"User already exists"+ (isUserAlreadyExists.email==email? "email already exists":"username already exist")
        })
    }
    const hash= await bcrypt.hash(password,10)
    const user=await userModel.create({
        username,bio,email,password:hash,profileImage
    })
    const token=jwt.sign({
        id:user._id,
        username:user.username
    },process.env.JWT_SECRET,{expiresIn:"1d"})
    res.cookie("token",token)
    res.status(201).json({
        message:"User Registered Successfully",
        user:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            profileImage:user.profileImage
        }
    })

}
async function loginController(req,res){
    const {username,email,password}=req.body;
    const user=await userModel.findOne({
        $or:[{
            username:username
        },{
            email:email
        }]
    }).select("+password")
    if(!user){
        return res.status(404).json({
            message:"User not found"
        })
    }
    
    const isPasswrodValid= await bcrypt.compare(password,user.password)
    if(!isPasswrodValid){
        return res.status(404).json({
            message:"Password is incorrect"
        })
    }
    const token=jwt.sign({
        id:user._id,
        username:user.username
    },process.env.JWT_SECRET,{expiresIn:"1d"})
    res.cookie("token",token)
    res.status(201).json({
        message:"User LoggedIn Successfully",
        user:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            profileImage:user.profileImage

        }
    })
}
async function getMeController(req,res){
    const userId=req.user.id;
    const user=await userModel.findById(userId)
    res.status(200).json({
        user:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            profileImage:user.profileImage
        }
    })
}
module.exports={
    registerController,
    loginController,
    getMeController
}