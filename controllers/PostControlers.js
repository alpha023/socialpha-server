const Post = require("../models/Post");
const User = require("../models/User");

const CreatePost = async (req, res) => {
  try {
    console.log(req.body);
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
};

const UpdatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("post updated successfully");
    } else {
      res.status(403).json("You Cant Update Others Posts");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const DeletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("post deleted successfully");
    } else {
      res.status(403).json("You Cant deleted Others Posts");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const LikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    await post.updateOne({ $push: { likes: req.body.userId } });
    console.log("post liked successfully");
    res.status(200).json("post liked successfully");
    // if (!post.likes.includes(req.body.userId)) {
    //   await post.updateOne({ $push: { likes: req.body.userId } });
    //   console.log("post liked successfully");
    //   res.status(200).json("post liked successfully");
    // } else {
    //   await post.updateOne({ $pull: { likes: req.body.userId } });
    //   console.log("post disliked successfully");
    //   res.status(200).json("post disliked successfully");
    // }
  } catch (err) {
    res.status(500).json(err);
  }
};

const dislikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    await post.updateOne({ $pull: { likes: req.body.userId } });
    console.log("post disliked successfully");
    res.status(200).json("post disliked successfully");
  } catch (err) {
    res.status(500).json(err)
  }
};

const isLikedByUser=async (req,res)=>{
  try {

    const post=await Post.findById(req.body.postId);
    const result=post.likes.includes(req.body.userId);
    res.status(200).json(result);
    
  } catch (err) {

    res.status(500).json(err);


    
  }
}

const GetPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
};

const GetTimelinePosts = async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.friends.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const CommentPost = async (req, res) => {
  try {
    const comment = {
      userId: req.body.userId,
      text: req.body.text,
    };
    const post = await Post.findById(req.params.id);

    await post.updateOne({ $push: { comments: comment } });
    res.status(200).json("You Commented...");

    // const alreadycommented = post.comments.map((c) => {
    //   return c.userId === req.body.userId;
    // });
    // if (!alreadycommented.includes(true)) {
    //   console.log(alreadycommented);
    //   await post.updateOne({ $push: { comments: comment } });
    //   res.status(200).json("Post Commented SuccessFully");
    // } else {
    //   res.status(403).json("already Commented");
    // }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getCommentsByUserId = async (req, res) => {
  try {
    const post = await Post.findById(req.body.postId);
    const user = await User.findById(req.body.user);
    const comments = post.comments.filter((c) => {
      return !(req.body.userId == c.userId);
    });

    // const newComment = {
    //   comments: comment,
    //   profilePic: user.profilePic,
    //   username: user.username,
    // };
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
};

const GetCommentsByPostId = async (req, res) => {
  try {
    const currentPost = await Post.findById(req.params.postId);
    res.status(200).json(currentPost.comments);
  } catch (err) {
    res.status(500).json(err);
  }
};

const GetAllPostsOfUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  CreatePost,
  isLikedByUser,
  getCommentsByUserId,
  UpdatePost,
  DeletePost,
  LikePost,
  GetPostById,
  GetTimelinePosts,
  CommentPost,
  GetAllPostsOfUser,
  GetCommentsByPostId,
  dislikePost
};
