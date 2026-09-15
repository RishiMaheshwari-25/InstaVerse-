require("dotenv").config()
const app=require("./src/app");
const connectToDb=require("./src/config/database");
connectToDb();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


// app.listen(3000,()=>{
//     console.log("Server is running on port 3000")
// })