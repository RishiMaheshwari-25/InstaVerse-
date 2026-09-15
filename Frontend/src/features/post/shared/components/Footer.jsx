import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../../../auth/hooks/useAuth"
import "../../style/footer.scss"

const Footer = () => {
    const {user}=useAuth()
    const navigate=useNavigate()
  return (
   <div className="footer">
    <footer >
        <button onClick={()=>{navigate("/profile")}}>
          Profile
         </button>
    </footer>
   </div>
  )
}

export default Footer
