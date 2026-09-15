const express=require("express");
const userController=require("../controllers/user.controller")
const identifyUser=require("../middlewares/auth.middleware")
const multer=require("multer");
const upload=multer({storage:multer.memoryStorage()});
const  userRouter=express.Router();

userRouter.get("/me",identifyUser,userController.getMyProfileController);
userRouter.patch("/me",identifyUser,userController.updateMyProfileController);
userRouter.patch("/me/image",identifyUser,upload.single("image"),userController.uploadProfileImageController);
userRouter.get("/discover",identifyUser,userController.getDiscoverUsersController);
userRouter.get("/connections",identifyUser,userController.getConnectionsController);
userRouter.post("/follow/:username",identifyUser,userController.followUserController);
userRouter.get("/follow-requests",identifyUser,userController.getFollowRequestController);
userRouter.patch("/follow-requests/:requestId",identifyUser,userController.followAccessController);


userRouter.delete("/unfollow/:username",identifyUser,userController.unfollowUsercontroller);

module.exports=userRouter;
