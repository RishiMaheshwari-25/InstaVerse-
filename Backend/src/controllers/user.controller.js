const followModel=require("../models/follow.model");
const userModel=require("../models/user.model")
const postModel=require("../models/post.model");
const ImageKit=require("@imagekit/nodejs");
const {toFile}=require("@imagekit/nodejs");
const imagekit=new ImageKit({privateKey:process.env.IMAGEKIT_PRIVATE_KEY});

// A single endpoint for the logged-in user's complete profile screen.
async function getMyProfileController(req,res){
    const userId=req.user.id;
    const [user, posts, followers, following] = await Promise.all([
        userModel.findById(userId).select("username email bio profileImage").lean(),
        postModel.find({user:userId}).sort({_id:-1}).lean(),
        followModel.countDocuments({followee:req.user.username,status:"accepted"}),
        followModel.countDocuments({follower:req.user.username,status:"accepted"})
    ]);

    if(!user){
        return res.status(404).json({message:"User not found"});
    }

    return res.status(200).json({
        user,
        stats:{posts:posts.length,followers,following},
        posts
    });
}

async function updateMyProfileController(req,res){
    const {bio,profileImage}=req.body;
    const updates={};
    if(typeof bio==="string") updates.bio=bio.trim().slice(0,160);
    if(typeof profileImage==="string") updates.profileImage=profileImage.trim();

    const user=await userModel.findByIdAndUpdate(
        req.user.id,
        {$set:updates},
        {new:true,runValidators:true}
    ).select("username email bio profileImage").lean();

    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    return res.status(200).json({message:"Profile updated successfully",user});
}

async function uploadProfileImageController(req,res){
    if(!req.file){
        return res.status(400).json({message:"Please choose an image file"});
    }
    const uploaded=await imagekit.files.upload({
        file:await toFile(Buffer.from(req.file.buffer),req.file.originalname),
        fileName:`profile-${req.user.id}-${Date.now()}`,
        folder:"cohort-2-insta-clone-profiles"
    });
    const user=await userModel.findByIdAndUpdate(
        req.user.id,
        {$set:{profileImage:uploaded.url}},
        {new:true}
    ).select("username email bio profileImage").lean();
    return res.status(200).json({message:"Profile image updated",user});
}

async function getDiscoverUsersController(req,res){
    const currentUsername=req.user.username;
    const users=await userModel.find({username:{$ne:currentUsername}})
        .select("username bio profileImage").sort({username:1}).lean();

    const people=await Promise.all(users.map(async(user)=>{
        const [followers,isFollowing]=await Promise.all([
            followModel.countDocuments({followee:user.username,status:"accepted"}),
            followModel.exists({follower:currentUsername,followee:user.username,status:"accepted"})
        ]);
        return {...user,followers,isFollowing:Boolean(isFollowing)};
    }));
    return res.status(200).json({users:people});
}

async function getConnectionsController(req,res){
    const type=req.query.type;
    if(!["followers","following"].includes(type)){
        return res.status(400).json({message:"type must be followers or following"});
    }
    const currentUsername=req.user.username;
    const records=await followModel.find(
        type==="followers"
            ? {followee:currentUsername,status:"accepted"}
            : {follower:currentUsername,status:"accepted"}
    ).sort({createdAt:-1}).lean();
    const usernames=records.map((record)=>type==="followers" ? record.follower : record.followee);
    const users=await userModel.find({username:{$in:usernames}}).select("username bio profileImage").lean();
    const userByName=new Map(users.map((user)=>[user.username,user]));
    return res.status(200).json({users:usernames.map((name)=>userByName.get(name)).filter(Boolean)});
}
async function followUserController(req,res){
    const followerUsername=req.user.username;//jo follow krrha hai
    const followeeUsername=req.params.username;//jisko follow kia jaarha hai
    
    if(followeeUsername==followerUsername){
        return res.status(400).json({
            message:"You can not follow Yourself"
        })
    }
    let follow=await followModel.findOne({
        follower:followerUsername,
        followee:followeeUsername
    })
    if(follow?.status==="accepted"){
        return res.status(409).json({
            message:`You are already following ${followeeUsername}`,
            follow
        })
    }
    const isFolloweeExists=await userModel.findOne({
        username:followeeUsername
    })
    if(!isFolloweeExists){
        return res.status(404).json({
            message:"User you are trying to follow does not exists"
        })
    }
    // Public profiles follow immediately, so profile counts update instantly.
    if(follow){
        follow.status="accepted";
        await follow.save();
    }else{
        follow=await followModel.create({follower:followerUsername,followee:followeeUsername,status:"accepted"});
    }
    return res.status(201).json({message:`You are now following ${followeeUsername}`,follow});


}
async function getFollowRequestController(req,res){
    const followeeUsername=req.user.username;
    const followRequests=await followModel.findOne({
        followee:followeeUsername,
        status:"pending"
    })
    res.status(200).json({
        requests:followRequests

    });
}
async function  followAccessController(req,res){
    const followeeUsername=req.user.username;
    const requestId=req.params.requestId;
    const {action}=req.body;
    if(!["accepted","rejected"].includes(action)){
        return res.status(400).json({
            message:"Action should be accpeted or rejected"
        })
    }
    const followRequest=await followModel.findOne({
        _id:requestId,
        followee:followeeUsername,
        status:"pending"
    })
    if(!followRequest){
        return res.status(404).json({
            message:"Pending follow request not found"
        })
    }
    followRequest.status=action;
    await followRequest.save();
    return res.status(200).json({
        message:`follow request is ${action}`,
        follow:followRequest
    })

}
async function unfollowUsercontroller(req,res){
    const followerUsername=req.user.username;
    const followeeUsername=req.params.username;
    const acceptedFollow=await followModel.findOne({
        follower:followerUsername,
        followee:followeeUsername,
        status:"accepted"

    })
    if(!acceptedFollow){
        return res.status(404).json({
            message:`You are not following ${followeeUsername}`
        })
    }
    await followModel.findByIdAndDelete(acceptedFollow._id)
    res.status(200).json({
        message:`You have unfollowed ${followeeUsername}`,

    })
}

module.exports={
    getMyProfileController,
    updateMyProfileController,
    uploadProfileImageController,
    getDiscoverUsersController,
    getConnectionsController,
    followUserController,
    getFollowRequestController,
    followAccessController,
    unfollowUsercontroller
}
