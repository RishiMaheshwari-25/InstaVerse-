import React ,{useState,useRef,useEffect} from 'react'
import "../style/postimage.scss"
import { usePost } from '../hook/usePost';
import { useNavigate } from 'react-router-dom';



const CreatePost = () => {
    const [caption,setCaption]=useState("");
    const postImageInputFieldRef=useRef()
    const {loading,handleCreatePost,handleGetFeed}=usePost()
    const navigate=useNavigate()
    async function handleSubmit(e){
        e.preventDefault()
        const file=postImageInputFieldRef.current.files[0]
        await handleCreatePost(file,caption)
        navigate("/")
    }
     useEffect(()=>{
        handleGetFeed()

    },[])
    if(loading){
        return(<main><h1>Creating a new Post...</h1></main>)
    }
   
  return (
    <main className="create-post-page">
        <div className="form-container">
            <h1>Create Post</h1>
            <form onSubmit={handleSubmit}>
                <label className= "post-image-label" htmlFor='postImage'>Select Image</label>
                <input ref={postImageInputFieldRef} hidden type="file" name="postImage" id="postImage" />
              <input 
              value={caption}
              onChange={(e)=>{setCaption(e.target.value)}}
              type="text" name="caption" id="caption"  placeholder='Enter Caption'/>
              <button className="button primary-button">New Post</button>
            </form>
        </div>
    </main>
  )
}

export default CreatePost
