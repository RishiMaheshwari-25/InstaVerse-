const postModel=require("../models/post.model");
const ImageKit=require("@imagekit/nodejs")
const {toFile}=require("@imagekit/nodejs")
const jwt=require("jsonwebtoken")
const likeModel=require("../models/like.model")
const  imagekit=new ImageKit({
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY
})

async function createPostController(req,res){
    console.log(req.body,req.file);
    
    const file=await imagekit.files.upload({
        file:await toFile(Buffer.from(req.file.buffer),"file"),
        fileName:"test",
        folder:'cohort-2-insta-clone-posts'
    })
    const post=await postModel.create({
        caption:req.body.caption,
        img_url:file.url,
        user:req.user.id
    })
    res.status(201).json({
        message:"Post created Successfully",
        post
    })
    
    // res.send(file)
}
async function getPostController(req,res){
    
    const UserId=req.user.id;
    const posts=await postModel.find({
      user:UserId
    
    })
    res.status(200).json({
        messaage:"Posts fetched Successfully",
        posts
    })

    
}
async function getPostDetailsController(req,res){
    
    const userId=req.user.id;
    const postId=req.params.postId;
    const post=await postModel.findById(postId);
    if(!post){
        return res.status(404).json({
            message:"Post not found"
        })
    }
    const isValidUser=post.user.toString()==userId;
    if(!isValidUser){
        return res.status(403).json({
            message:"Forbidden Content"
        })
    }
    res.status(200).json({
        message:"Post Fetched Successfully",
        post
    })

}
async function likePostController(req,res){
    const username=req.user.username;
    const postId=req.params.postId;
    const post=await postModel.findById(postId);
    if(!post){
        return res.status(404).json({
            message:"Post not found"
        })
    }
    const like=await likeModel.create({
        user:username,
        post:postId

    })
    res.status(200).json({
        message:"Post liked Successfully",
        like
    })
}
async function unlikePostController(req,res){
    const username=req.user.username;
    const postId=req.params.postId;
    const isLiked=await likeModel.findOne({
        user:username,
        post:postId
    })
    if(!isLiked){
        return res.status(400).json({
            message:"Post didnt't like"
        })
    }
    await likeModel.findOneAndDelete({_id:isLiked._id});
    res.status(200).json({
        message:"Post unliked Successfully",
        
    })
}
async function getFeedController(req,res){
    const user=req.user
    const posts = await Promise.all((await postModel.find().sort({_id:-1}).populate("user").lean())
    .map(async(post)=>{
        const isLiked=await likeModel.findOne({
            user:user.username,
            post:post._id
            
        })
        post.isLiked=Boolean(isLiked)
        return post
    }))
    res.status(200).json({
        message:"Post Fetched Successfully",
        posts
    })
}

    

module.exports={
    createPostController,
    getPostController,
    getPostDetailsController,
    likePostController,
    getFeedController,
    unlikePostController
}