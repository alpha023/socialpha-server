const bcrypt = require("bcrypt");
const User = require("../models/User");

const UpdateUser = async (req, res) => {
  //console.log(req.body.userId===req.params.id)
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account Updated SuccessFully");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("you can update only your account");
  }
};

const DeleteUser = async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account Deleted Successfully");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can delete only your account");
  }
};

const GetUserByIdOrUsername = async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;

  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    //console.log("internal error")
    return res.status(500).json(err);
  }
};

const GetAllFriendsOfUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (err) {
    res.status(500).json(err);
  }
};

const FollowUser = async (req, res) => {
  console.log(!(req.body.userId === req.params.id));

  if (!(req.body.userId === req.params.id)) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      console.log(!user.followers.includes(req.body.userId));
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user followed");
      } else {
        res.status(403).json("you already followed this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
};

const UnfollowUser = async (req, res) => {
  console.log(!(req.body.userId === req.params.id));

  if (!(req.body.userId === req.params.id)) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      console.log(!user.followers.includes(req.body.userId));
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user unfollowed");
      } else {
        res.status(403).json("you already unfollowed this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
};

const GetAllSuggestedUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id);
    const reqSentByCurrentUser = currentUser.requestSent;
    let users = await User.find();
    users = users.filter((user) => {
      return !(
        user._id.toString() === currentUser._id.toString() ||
        reqSentByCurrentUser.includes(user._id) ||
        currentUser.friends.includes(user._id.toString()) ||
        currentUser.requestGet.includes(user._id.toString())
      );
    });
    users = users.map((user) => {
      const { password, updatedAt, ...other } = user._doc;
      return other;
    });
    // console.log(users);

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const SendFriendRequest = async (req, res) => {
  try {
    const reqSendByUser = await User.findById(req.params.reqSendBy);
    const reqSendToUser = await User.findById(req.params.reqSendTo);
    await reqSendByUser.updateOne({
      $push: { requestSent: req.params.reqSendTo },
    });
    await reqSendToUser.updateOne({
      $push: { requestGet: req.params.reqSendBy },
    });
    res.status(200).json("Request Send SuccessFully");
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};

const CancelFriendRequest = async (req, res) => {
  try {
    const reqCancelByUser = await User.findById(req.params.reqCancelBy);
    const reqCancelOfUser = await User.findById(req.params.reqCancelOf);
    await reqCancelByUser.updateOne({
      $pull: { requestSent: reqCancelOfUser._id },
    });
    await reqCancelOfUser.updateOne({
      $pull: { requestGet: reqCancelByUser._id },
    });
    res.status(200).json("Request Cancelled SuccessFully");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const GetAllFriendRequests = async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id);
    let friendrequests = currentUser.requestGet;
    //
    const newFriendReqList = await Promise.all(
      friendrequests.map((friendId) => {
        return User.findById(friendId);
      })
    );

    res.status(200).json(newFriendReqList);
  } catch (err) {
    res.status(500).json(err);
  }
};

const AcceptFriendRequest = async (req, res) => {
  try {
    const acceptedByUser = await User.findById(req.params.acceptedBy);
    const acceptedOfUser = await User.findById(req.params.acceptedOf);

    await acceptedByUser.updateOne({
      $push: {
        friends: req.params.acceptedOf,
      },
    });
    await acceptedOfUser.updateOne({
      $push: {
        friends: req.params.acceptedBy,
      },
    });
    await acceptedByUser.updateOne({
      $pull: {
        requestGet: req.params.acceptedOf,
      },
    });
    await acceptedOfUser.updateOne({
      $pull: {
        requestSent: req.params.acceptedBy,
      },
    });
    res.status(200).json("Request Accepted Successfully");
  } catch (err) {
    res.status(500).json(err);
  }
};

const RejectIncomingFriendRequest = async (req, res) => {
  try {
    const cancelByUser = await User.findById(req.params.cancelBy);
    const cancelOfUser = await User.findById(req.params.cancelOf);

    await cancelByUser.updateOne({
      $pull: {
        requestGet: req.params.cancelOf,
      },
    });
    await cancelOfUser.updateOne({
      $pull: {
        requestSent: req.params.cancelBy,
      },
    });
    res.status(200).json("Request Rejected Successfully");
  } catch (err) {
    res.status(500).json(err);
  }
};

const GetMyAllFriends = async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id);
    const friendsList = currentUser.friends;

    //
    const newFriendList = await Promise.all(
      friendsList.map((friendId) => {
        return User.findById(friendId);
      })
    );
    //

    res.status(200).json(newFriendList);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports={
    UpdateUser, DeleteUser, GetUserByIdOrUsername, GetAllFriendsOfUser, FollowUser, UnfollowUser, GetAllSuggestedUsers, SendFriendRequest, CancelFriendRequest, GetAllFriendRequests, AcceptFriendRequest, RejectIncomingFriendRequest, GetMyAllFriends 

}