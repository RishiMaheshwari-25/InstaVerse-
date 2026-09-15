import React from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './Approutes'
import "./style.scss"
import { AuthProvider } from './features/auth/auth.context.jsx'
import { PostContextProvider } from './features/post/post.context.jsx'

const App = () => {
  return (
    <AuthProvider>
      <PostContextProvider>
         <RouterProvider router={router}/>
      </PostContextProvider>
      
    </AuthProvider>
   
   
  )
}

export default App
