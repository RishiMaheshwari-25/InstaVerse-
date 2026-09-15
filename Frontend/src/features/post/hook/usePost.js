import {getFeed,createPost, likePost, unlikePost} from "../services/post.api"
import { useContext } from "react";
import { PostContext } from "../post.context";
export const usePost=()=>{
    const context=useContext(PostContext);
    const {loading,setLoading,post,setPost,feed,setFeed}=context
    const handleGetFeed=async ()=>{
        setLoading(true);
        const data=await getFeed();
        setFeed(data.posts)
        setLoading(false);
        
    }
    const handleCreatePost= async (imageFile,caption)=>{
        setLoading(true);
        const data=await createPost(imageFile,caption);
        setFeed([data.post,...feed])
        setLoading(false)

    }
    const handleLike=async (post)=>{
      
        const data=await likePost(post)
        await handleGetFeed()
        
    }
    const handleUnlike=async (post)=>{
        
        const data=await unlikePost(post)
        await handleGetFeed()
      
    }
    return {loading,post,feed,handleGetFeed,handleCreatePost,handleLike,handleUnlike}
}