import React,{useState} from 'react'
import "../style/auth.scss"
import { Link,useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
const Login = () => {
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [error,setError]=useState("");
    const navigate=useNavigate()
    const {handleLogin,loading}=useAuth()
     async function handleSubmit(e){
    e.preventDefault();
    setError("")
    try { await handleLogin(username,password); navigate("/"); }
    catch(err) { setError(err.response?.data?.message || "Unable to sign in. Please try again."); }
    }
  return (
   <main className="auth-page">
    <div className="auth-card">
        <p className="auth-brand">InstaVerse</p><p className="auth-kicker">WELCOME BACK</p><h1>Continue your story.</h1><p className="auth-subtitle">Your people and moments are waiting for you.</p>
        <form onSubmit={handleSubmit}>
            <label>Username
            <input onInput={(e)=>{setUsername(e.target.value)}}
            type="text" 
            name="username" 
            id="username"
            placeholder='Enter Username' required /></label>
            <label>Password
            <input onInput={(e)=>{setPassword(e.target.value)}}
            type="password" 
            name="password"
            id="password"
             placeholder="Enter Password" required/></label>
            {error && <p className="auth-error">{error}</p>}
            <button className="auth-submit" disabled={loading} type="submit">{loading ? "Signing in..." : "Login to InstaVerse"}</button>
        </form>
        <p className="auth-switch">New here? <Link to="/register">Create your account</Link></p>
        
    </div>
   </main>
  )
}

export default Login
