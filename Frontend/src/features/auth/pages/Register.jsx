import React,{useState} from 'react'
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import "../style/auth.scss"

const Register = () => {
    const [username,setUsername]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [error,setError]=useState("");
    const navigate=useNavigate()
    const {handleRegister,loading}=useAuth()
    async function handleSubmit(e){
        e.preventDefault();
       setError("");
       try { await handleRegister(username,email,password); navigate("/"); }
       catch(err) { setError(err.response?.data?.message || "Unable to create your account."); }
    }

  return (
    
    <main className="auth-page">
    <div className="auth-card">
        <p className="auth-brand">InstaVerse</p><p className="auth-kicker">START YOUR JOURNEY</p><h1>Create your corner of the internet.</h1><p className="auth-subtitle">Join a thoughtful community built around moments that matter.</p>
        <form onSubmit={handleSubmit}>
            <label>Username
            <input  onInput={(e)=>{setUsername(e.target.value)}}
            type="text" 
            name="username"
             placeholder='Choose a username' required/></label>
            <label>Email
            <input onInput={(e)=>{setEmail(e.target.value)}}
            type="email" 
            name="email" 
            placeholder='you@example.com' required/></label>
            <label>Password
            <input onInput={(e)=>{setPassword(e.target.value)}}
            type="password" 
            name="password" 
            placeholder="Create a password" required/></label>
            {error && <p className="auth-error">{error}</p>}
            <button className="auth-submit" disabled={loading} type="submit">{loading ? "Creating account..." : "Create my account"}</button>
        </form>
         <p className="auth-switch">Already a member? <Link to="/login">Log in</Link></p>
        
    </div>
   </main>
  )
}

export default Register
