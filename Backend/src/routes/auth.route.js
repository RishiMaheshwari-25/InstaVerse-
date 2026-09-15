const express=require("express");

const authRouter=express.Router();
const authController=require("../controllers/auth.controllers")
const identifyUser=require("../middlewares/auth.middleware")


authRouter.post("/register",authController.registerController)
authRouter.post("/login",authController.loginController)

/*fetch currently loggedin user detail*/
authRouter.get("/get-me",identifyUser,authController.getMeController)
module.exports=authRouter;