import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import "../style/feed.scss"
import "../style/feed-enhanced.scss"
import Post from '../components/Post'
import { usePost } from '../hook/usePost'
import Nav from '../shared/components/Nav'
import { useAuth } from '../../auth/hooks/useAuth'
import Footer from '../shared/components/Footer'

const Feed = () => {
    const {feed,handleGetFeed,loading,handleLike,handleUnlike}=usePost()
    const {setUser}=useAuth()
    const navigate=useNavigate()
    useEffect(()=>{
        handleGetFeed().catch((err)=>{
            if(err.response?.status===401){
                setUser(null)
                navigate("/register", { replace: true })
            }
        })
    },[])
    if(loading || !feed){
        return (<main><h1>Feed is loadng...</h1></main>)
    }
    console.log(feed)
  return (
    <main className="feed-page">
        <Nav/>
        <div className="feed">
            <header className="feed-intro"><p>THE DAILY EDIT</p><h1>Moments from your world.</h1><span>Fresh perspectives, one scroll at a time.</span></header>
            <div className="posts">
                {feed.map(post=>{
                    return <Post user={post.user} post={post} loading={loading} handleLike={handleLike} handleunLike={handleUnlike}/>
                })}
                
            </div>
          
        </div>
       <Footer/>
    </main>
    
  )
}

export default Feed
