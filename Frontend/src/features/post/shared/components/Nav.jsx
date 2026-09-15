import React from 'react'
import "../../style/nav.scss"
import { useNavigate } from 'react-router-dom' 


const Nav = ({ variant = "default" }) => {
    const navigate=useNavigate()
  return (
    <nav className={`nav-bar ${variant === "profile" ? "nav-bar--profile" : ""}`}>
        <button className="brand" onClick={()=>{navigate("/")}} type="button">InstaVerse</button>
        <div className="nav-actions"><button onClick={()=>{navigate("/create-post")}}
        className="button primary-button" type="button"><span>+</span> New Post</button></div>
    </nav>
  )
}

export default Nav
