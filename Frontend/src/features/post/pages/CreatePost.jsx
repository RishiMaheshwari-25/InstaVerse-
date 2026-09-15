import React ,{useState,useRef,useEffect} from 'react'
import "../style/postimage.scss"
import { usePost } from '../hook/usePost';
import { useNavigate } from 'react-router-dom';



const CreatePost = () => {
    const [caption,setCaption]=useState("");
    const [imagePreview,setImagePreview]=useState("");
    const [error,setError]=useState("");
    const postImageInputFieldRef=useRef()
    const {loading,handleCreatePost,handleGetFeed}=usePost()
    const navigate=useNavigate()
    async function handleSubmit(e){
        e.preventDefault()
        const file=postImageInputFieldRef.current.files[0]
        if(!file){ setError("Choose an image before publishing your post."); return; }
        await handleCreatePost(file,caption)
        navigate("/")
    }
    function handleImageChange(event){
        const file=event.target.files?.[0];
        if(!file) return;
        setImagePreview(URL.createObjectURL(file));
        setError("");
    }
     useEffect(()=>{
        handleGetFeed()
    },[])
    useEffect(()=>()=>{ if(imagePreview) URL.revokeObjectURL(imagePreview); },[imagePreview])
    if(loading){
        return(<main><h1>Creating a new Post...</h1></main>)
    }
   
  return (
    <main className="create-post-page">
        <div className="form-container">
            <h1>Create Post</h1>
            <form onSubmit={handleSubmit}>
                <label className={`post-image-label ${imagePreview ? "has-image" : ""}`} htmlFor='postImage'>
                  {imagePreview ? <><img src={imagePreview} alt="Selected post preview" /><span className="change-image">Change image</span></> : <><span className="upload-symbol">+</span><strong>Select an image</strong><small>PNG, JPG or JPEG</small></>}
                </label>
                <input ref={postImageInputFieldRef} onChange={handleImageChange} hidden accept="image/png,image/jpeg,image/jpg,image/webp" type="file" name="postImage" id="postImage" />
                {error && <p className="create-post-error">{error}</p>}
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
