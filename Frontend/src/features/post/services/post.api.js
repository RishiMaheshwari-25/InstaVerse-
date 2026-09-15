import axios from"axios"
const api=axios.create({
    baseURL:"http://localhost:3000/api/posts",
    withCredentials:true
})
export async function getFeed(){
    const response= await api.get("/feed");
    return response.data
}
export async function createPost(imageFile,caption){
    const formData=new FormData();
    formData.append("image",imageFile);
    formData.append("caption",caption);
    const response=await api.post("/",formData)
    return response.data
}
export async function likePost(postId){
    const response=await api.post("/like/"+postId)
    return response.data
}
export async function unlikePost(postId){
    const response=await api.post("/unlike/"+postId)
    return response.data

}
export async function deletePost(postId){
    const response=await api.delete("/"+postId)
    return response.data
}
export async function getComments(postId){
    const response=await api.get(`/${postId}/comments`)
    return response.data
}
export async function addComment(postId,text){
    const response=await api.post(`/${postId}/comments`,{text})
    return response.data
}
export async function savePost(postId){
    const response=await api.post(`/save/${postId}`)
    return response.data
}
export async function unsavePost(postId){
    const response=await api.delete(`/save/${postId}`)
    return response.data
}
export async function getSavedPosts(){
    const response=await api.get("/saved")
    return response.data
}
