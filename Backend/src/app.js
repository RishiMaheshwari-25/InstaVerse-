const express=require("express");
const app=express();
const cookieParser=require("cookie-parser");
const cors=require("cors")

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials:true,
    origin:"http://localhost:5173"
}))
/* required
routes*/
const authRouter=require("./routes/auth.route")
const postRouter=require("./routes/post.routes")
const userRouter=require("./routes/user.route")

/* using routes*/
app.use("/api/auth",authRouter);
app.use("/api/posts",postRouter)
app.use("/api/users",userRouter)
module.exports=app;