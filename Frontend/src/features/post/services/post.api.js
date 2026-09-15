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