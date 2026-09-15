import React, { useEffect, useState } from 'react'
import { addComment, getComments, savePost, unsavePost } from '../services/post.api'
import "../style/engagement.scss"

const Post = ({user,post,loading,handleLike,handleunLike}) => {
    const [showComments,setShowComments]=useState(false)
    const [comments,setComments]=useState([])
    const [commentText,setCommentText]=useState("")
    const [isCommentLoading,setIsCommentLoading]=useState(false)
    const [isSaved,setIsSaved]=useState(Boolean(post.isSaved))
    const [notice,setNotice]=useState("")

    useEffect(()=>setIsSaved(Boolean(post.isSaved)),[post.isSaved])

    const toggleComments=async()=>{
        if(showComments){ setShowComments(false); return; }
        setIsCommentLoading(true); setNotice("")
        try { const data=await getComments(post._id); setComments(data.comments); setShowComments(true); }
        catch { setNotice("Comments could not be loaded."); }
        finally { setIsCommentLoading(false); }
    }
    const submitComment=async(event)=>{
        event.preventDefault()
        if(!commentText.trim()) return
        try { const data=await addComment(post._id,commentText); setComments((current)=>[data.comment,...current]); setCommentText(""); }
        catch { setNotice("Your comment could not be posted."); }
    }
    const toggleSave=async()=>{
        const previous=isSaved; setIsSaved(!previous); setNotice("")
        try { if(previous) await unsavePost(post._id); else await savePost(post._id); }
        catch { setIsSaved(previous); setNotice("This post could not be saved."); }
    }
    const sharePost=async()=>{
        const shareData={title:"InstaVerse",text:post.caption || "A post from InstaVerse",url:window.location.href}
        try {
            if(navigator.share) await navigator.share(shareData)
            else { await navigator.clipboard.writeText(window.location.href); setNotice("Link copied to clipboard."); }
        } catch(err) { if(err.name!=="AbortError") setNotice("Sharing is not available on this device."); }
    }
    const handleActions=(event)=>{
        const button=event.target.closest("button")
        if(!button) return
        event.stopPropagation()
        const action=[...event.currentTarget.querySelectorAll("button")].indexOf(button)
        if(action===0) post.isLiked?handleunLike(post._id):handleLike(post._id)
        if(action===1) toggleComments()
        if(action===2) sharePost()
        if(action===3) toggleSave()
    }
    
  return (
    <div className="post">
                    <div className="user">
                        <div className="img-wrapper">
                             <img src={user.profileImage} alt=""/>

                        </div>
                   
                    <p>{user.username}</p>
                </div>
                <img src={post.img_url} alt=""  />
                <div className={`icons ${isSaved ? "post-saved" : ""}`} onClickCapture={handleActions}>
                    <div className="left">
                        <button><svg  className={post.isLiked?"like":""}
                        onClick={()=>{post.isLiked?handleunLike(post._id):handleLike(post._id)}}
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853ZM18.827 6.1701C17.3279 4.66794 14.9076 4.60701 13.337 6.01687L12.0019 7.21524L10.6661 6.01781C9.09098 4.60597 6.67506 4.66808 5.17157 6.17157C3.68183 7.66131 3.60704 10.0473 4.97993 11.6232L11.9999 18.6543L19.0201 11.6232C20.3935 10.0467 20.319 7.66525 18.827 6.1701Z"></path></svg></button>
                        <button><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5.76282 17H20V5H4V18.3851L5.76282 17ZM6.45455 19L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.45455Z"></path></svg></button>
                        <button><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13 14H11C7.54202 14 4.53953 15.9502 3.03239 18.8107C3.01093 18.5433 3 18.2729 3 18C3 12.4772 7.47715 8 13 8V2.5L23.5 11L13 19.5V14ZM11 12H15V15.3078L20.3214 11L15 6.69224V10H13C10.5795 10 8.41011 11.0749 6.94312 12.7735C8.20873 12.2714 9.58041 12 11 12Z"></path></svg></button>
                    </div>
                    <div className="right">
                        <button><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5 2H19C19.5523 2 20 2.44772 20 3V22.1433C20 22.4194 19.7761 22.6434 19.5 22.6434C19.4061 22.6434 19.314 22.6168 19.2344 22.5669L12 18.0313L4.76559 22.5669C4.53163 22.7136 4.22306 22.6429 4.07637 22.4089C4.02647 22.3293 4 22.2373 4 22.1433V3C4 2.44772 4.44772 2 5 2ZM18 4H6V19.4324L12 15.6707L18 19.4324V4Z"></path></svg></button>
                    </div>
                </div>
                <div className="bottom">
                    <p className="caption">{post.caption}</p>
                    <p className="engagement-note">{comments.length || post.commentCount || 0} comments {notice && `- ${notice}`}</p>
                    {showComments && <div className="comments-panel">{isCommentLoading ? <p>Loading comments...</p> : <><form onSubmit={submitComment}><input value={commentText} onChange={(event)=>setCommentText(event.target.value)} maxLength="300" placeholder="Write a comment..." /><button type="submit">Post</button></form><div className="comment-list">{comments.length ? comments.map((comment)=><p key={comment._id}><strong>@{comment.user}</strong> {comment.text}</p>) : <p className="no-comments">Be the first to leave a thought.</p>}</div></>}</div>}
                </div>
                </div>
  )
}

export default Post
