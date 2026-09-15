import {getFeed,createPost, likePost, unlikePost} from "../services/post.api"
import { useContext } from "react";
import { PostContext } from "../post.context";
export const usePost=()=>{
    const context=useContext(PostContext);
    const {loading,setLoading,post,setPost,feed,setFeed}=context
    const handleGetFeed=async ()=>{
        setLoading(true);
        try {
            const data=await getFeed();
            setFeed(data.posts)
        } finally {
            setLoading(false);
        }
        
    }
    const handleCreatePost= async (imageFile,caption)=>{
        setLoading(true);
        const data=await createPost(imageFile,caption);
        setFeed([data.post,...feed])
        setLoading(false)

    }
    const handleLike=async (postId)=>{
        // Optimistic update: the heart changes instantly instead of reloading the feed.
        setFeed((current)=>current?.map((post)=>post._id===postId ? {...post,isLiked:true} : post));
        try{
            await likePost(postId);
        }catch(err){
            // Restore the previous state only when the request genuinely fails.
            setFeed((current)=>current?.map((post)=>post._id===postId ? {...post,isLiked:false} : post));
            console.error("Unable to like post",err);
        }
    }
    const handleUnlike=async (postId)=>{
        setFeed((current)=>current?.map((post)=>post._id===postId ? {...post,isLiked:false} : post));
        try{
            await unlikePost(postId);
        }catch(err){
            setFeed((current)=>current?.map((post)=>post._id===postId ? {...post,isLiked:true} : post));
            console.error("Unable to unlike post",err);
        }
    }
    return {loading,post,feed,handleGetFeed,handleCreatePost,handleLike,handleUnlike}
}
