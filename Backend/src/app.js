const path=require("path")
const express=require("express");
const app=express();

const cookieParser=require("cookie-parser");
const cors=require("cors")

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials:true,
    origin:true
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

app.use(express.static(path.join(__dirname, "../public")));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});
module.exports=app;