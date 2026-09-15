import React,{useState} from 'react'
import {Link} from 'react-router'
import { useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Register = () => {
    const [username,setUsername]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate()
    const {handleRegister,loading}=useAuth()
    if(loading){
        return <h1>Loading...</h1>
    }
    async function handleSubmit(e){
        e.preventDefault();
       await  handleRegister(username,email,password)
       .then((res)=>{
        console.log(res)
        navigate("/")

        
       })

        
    }

  return (
    
    <main>
    <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
            <input  onInput={(e)=>{setUsername(e.target.value)}}
            type="text" 
            name="username"
             placeholder='Enter Username' />
            <input onInput={(e)=>{setEmail(e.target.value)}}
            type="text" 
            name="email" 
            placeholder='Enter email' />
            <input onInput={(e)=>{setPassword(e.target.value)}}
            type="text" 
            name="password" 
            placeholder="Enter Password"/>
            <button type="submit">Register</button>
        </form>
         <p>Already  have an account? <Link className="toggleAuthForm" to="/login">Login</Link></p>
        
    </div>
   </main>
  )
}

export default Register
