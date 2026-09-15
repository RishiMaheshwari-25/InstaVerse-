const express=require("express");
const userController=require("../controllers/user.controller")
const identifyUser=require("../middlewares/auth.middleware")
const  userRouter=express.Router();

userRouter.post("/follow/:username",identifyUser,userController.followUserController);
userRouter.get("/follow-requests",identifyUser,userController.getFollowRequestController);
userRouter.patch("/follow-requests/:requestId",identifyUser,userController.followAccessController);


userRouter.delete("/unfollow/:username",identifyUser,userController.unfollowUsercontroller);

module.exports=userRouter;