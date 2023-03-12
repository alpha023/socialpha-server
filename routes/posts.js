const router = require("express").Router();

const { CreatePost, UpdatePost, DeletePost, LikePost,dislikePost, GetPostById, GetTimelinePosts, CommentPost,isLikedByUser, GetAllPostsOfUser, getCommentsByUserId, GetCommentsByPostId, } = require("../controllers/PostControlers");

router.get("/", (req, res) => {
  console.log("post page");
});

//create a post
router.post("/createpost",CreatePost );

//update a post
router.put("/updatepost/:id", UpdatePost);

//delete a post
router.delete("/deletepost/:id",DeletePost );

//like a post
router.put("/:id/like", LikePost);

//isliked by user
router.get("/isliked",isLikedByUser);

//dislike a post
router.put("/:id/dislike", dislikePost);

//get post by id
router.get("/getpost/:id", GetPostById);

//get timeline posts
router.get("/timelineposts/:userId",GetTimelinePosts);

//comment a post
router.post("/commentpost/:id",CommentPost );

//get users all posts
router.get("/profile/:username", GetAllPostsOfUser);

// router.get('/getcomments',getCommentsByUserId);

router.get('/getcomments/:postId',GetCommentsByPostId);

module.exports = router;
