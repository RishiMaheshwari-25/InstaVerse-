import React,{useState} from 'react'
import "../style/form.scss"

import { Link } from 'react-router'
import Register from './Register'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
const Login = () => {
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate()
    const {handleLogin,loading}=useAuth()
    if(loading){
        return <h1>Loading...</h1>
    }
     async function handleSubmit(e){
    e.preventDefault();
    await handleLogin(username,password)
    .then((res)=>{
        console.log(res)
        navigate("/")
    })
    


    }
  return (
   <main>
    <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <input onInput={(e)=>{setUsername(e.target.value)}}
            type="text" 
            name="username" 
            id="username"
            placeholder='Enter Username' />
            <input onInput={(e)=>{setPassword(e.target.value)}}
            type="text" 
            name="password"
            id="password"
             placeholder="Enter Password"/>
            <button className="button primary-button"type="submit">Login</button>
        </form>
        <p>Don't have an account? <Link className="toggleAuthForm" to="/register">Register</Link></p>
        
    </div>
   </main>
  )
}

export default Login
