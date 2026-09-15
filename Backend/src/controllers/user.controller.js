const followModel=require("../models/follow.model");
const userModel=require("../models/user.model")
async function followUserController(req,res){
    const followerUsername=req.user.username;//jo follow krrha hai
    const followeeUsername=req.params.username;//jisko follow kia jaarha hai
    
    if(followeeUsername==followerUsername){
        return res.status(400).json({
            message:"You can not follow Yourself"
        })
    }
    const isAlreadyFollowing=await followModel.findOne({
        follower:followerUsername,
        followee:followeeUsername
    })
    if(isAlreadyFollowing){
        return res.status(409).json({
            message:`Already sent request to the ${followeeUsername}`,
            follow:isAlreadyFollowing
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
    const existingFollow=await followModel.findOne({
        follower:followerUsername,
        followee:followeeUsername
    });
    if(existingFollow){
        if(existingFollow.status==="pending"){
            return res.status(409).json({
                message:"Follow request is already pending",
                follow:existingFollow
            })
        }
    }
    if(existingFollow){
        if(existingFollow.status==="accepted"){
            return res.status(409).json({
                message:`You are already following the ${followeeUsername}`,
                follow:existingFollow
            })
        }
    }
     existingFollow.status=="pending";//jb reject hogi requets tab chlega yeh
     await existingFollow.save();
     res.status(200).json({
        message:`Follow request sent again to ${followeeUsername}`,
        follow:existingFollow
     })

    const followRecord=await followModel.create({
        follower:followerUsername,
        followee:followeeUsername,
        status:"pending"
    
        
        
    });

    res.status(201).json({
        message:`Follow request sent to the ${followeeUsername}`,
        follow:followRecord
    })


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
    followUserController,
    getFollowRequestController,
    followAccessController,
    unfollowUsercontroller
}