const express=require("express");
const postRouter=express.Router();
const multer=require("multer");
const identifyUser=require("../middlewares/auth.middleware")
const upload=multer({storage:multer.memoryStorage()})
const PostController=require("../controllers/post.controller")
postRouter.post("/",upload.single("image"),identifyUser,PostController.createPostController );
postRouter.get("/",identifyUser,PostController.getPostController);
postRouter.get("/details/:postId",identifyUser,PostController.getPostDetailsController);
postRouter.get("/saved",identifyUser,PostController.getSavedPostsController);
postRouter.delete("/:postId",identifyUser,PostController.deletePostController);
postRouter.get("/:postId/comments",identifyUser,PostController.getCommentsController);
postRouter.post("/:postId/comments",identifyUser,PostController.addCommentController);


/*like api*/
postRouter.post("/like/:postId",identifyUser,PostController.likePostController);

/*unlike api*/
postRouter.post("/unlike/:postId",identifyUser,PostController.unlikePostController)
postRouter.post("/save/:postId",identifyUser,PostController.savePostController);
postRouter.delete("/save/:postId",identifyUser,PostController.unsavePostController);
/* new get api to get all the post presnet in db for feed page*/
postRouter.get("/feed",identifyUser,PostController.getFeedController);



module.exports=postRouter;
