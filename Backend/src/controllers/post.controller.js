const postModel=require("../models/post.model");
const ImageKit=require("@imagekit/nodejs")
const {toFile}=require("@imagekit/nodejs")
const jwt=require("jsonwebtoken")
const likeModel=require("../models/like.model")
const commentModel=require("../models/comment.model");
const saveModel=require("../models/save.model");
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
async function deletePostController(req,res){
    const post=await postModel.findById(req.params.postId);
    if(!post){
        return res.status(404).json({message:"Post not found"});
    }
    if(post.user.toString()!==req.user.id){
        return res.status(403).json({message:"You can only delete your own posts"});
    }
    await Promise.all([
        likeModel.deleteMany({post:post._id}),
        commentModel.deleteMany({post:post._id}),
        saveModel.deleteMany({post:post._id}),
        postModel.findByIdAndDelete(post._id)
    ]);
    return res.status(200).json({message:"Post deleted successfully",postId:post._id});
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
async function getCommentsController(req,res){
    const post=await postModel.findById(req.params.postId);
    if(!post) return res.status(404).json({message:"Post not found"});
    const comments=await commentModel.find({post:post._id}).sort({createdAt:-1}).lean();
    return res.status(200).json({comments});
}

async function addCommentController(req,res){
    const text=req.body.text?.trim();
    if(!text) return res.status(400).json({message:"Comment cannot be empty"});
    const post=await postModel.findById(req.params.postId);
    if(!post) return res.status(404).json({message:"Post not found"});
    const comment=await commentModel.create({post:post._id,user:req.user.username,text});
    return res.status(201).json({message:"Comment added",comment});
}

async function savePostController(req,res){
    const post=await postModel.findById(req.params.postId);
    if(!post) return res.status(404).json({message:"Post not found"});
    const existing=await saveModel.findOne({post:post._id,user:req.user.username});
    if(existing) return res.status(409).json({message:"Post is already saved"});
    const save=await saveModel.create({post:post._id,user:req.user.username});
    return res.status(201).json({message:"Post saved",save});
}

async function unsavePostController(req,res){
    const save=await saveModel.findOneAndDelete({post:req.params.postId,user:req.user.username});
    if(!save) return res.status(404).json({message:"Saved post not found"});
    return res.status(200).json({message:"Post removed from saved posts"});
}

async function getSavedPostsController(req,res){
    const saves=await saveModel.find({user:req.user.username})
        .sort({createdAt:-1})
        .populate({path:"post",populate:{path:"user",select:"username profileImage"}})
        .lean();
    const posts=saves.map((save)=>save.post).filter(Boolean).map((post)=>({...post,isSaved:true}));
    return res.status(200).json({posts});
}

async function getFeedController(req,res){
    const user=req.user
    const posts = await Promise.all((await postModel.find().sort({_id:-1}).populate("user").lean())
    .map(async(post)=>{
        const [isLiked,isSaved,commentCount]=await Promise.all([
            likeModel.exists({user:user.username,post:post._id}),
            saveModel.exists({user:user.username,post:post._id}),
            commentModel.countDocuments({post:post._id})
        ]);
        post.isLiked=Boolean(isLiked)
        post.isSaved=Boolean(isSaved)
        post.commentCount=commentCount
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
    deletePostController,
    likePostController,
    getCommentsController,
    addCommentController,
    savePostController,
    unsavePostController,
    getSavedPostsController,
    getFeedController,
    unlikePostController
}
