// import {BrowserRouter,Routes,Route} from "react-router"
import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/login"
import Register from "./features/auth/pages/Register"
import Feed from "./features/post/pages/Feed"
import CreatePost from "./features/post/pages/CreatePost";
// function AppRoutes(){
//     return <BrowserRouter>
//     <Routes>
//         <Route path="/" element={<h1>Welcome to the App</h1>}/>
//         <Route path="/login" element={<Login/>}/>
//         <Route path="/register" element={<Register/>}/>
//     </Routes>
//     </BrowserRouter>
// }
export const router=createBrowserRouter([{
    path:"/login",
    element:<Login/>
},
{
    path:"/register",
    element:<Register/>
},
{
    path:"/",
    element:<Feed/>
},
{
    path:"/create-post",
    element:<CreatePost/>
}]
)
export default  router;