
// // const router = require("express");
// import express from 'express';
// const router=express.Router();
const router=require('express').Router();

const { UpdateUser, DeleteUser, GetUserByIdOrUsername, GetAllFriendsOfUser, FollowUser, UnfollowUser, GetAllSuggestedUsers, SendFriendRequest, CancelFriendRequest, GetAllFriendRequests, AcceptFriendRequest, RejectIncomingFriendRequest, GetMyAllFriends } = require('../controllers/UserControlers');

//update user
router.put("/:id", UpdateUser);

//delete user
router.delete("/:id",DeleteUser );

//get a user
router.get("/",GetUserByIdOrUsername );

//get friends
router.get("/friends/:userId",GetAllFriendsOfUser );

//follow a user
router.put("/:id/follow",FollowUser );

//unfollow a user
router.put("/:id/unfollow", UnfollowUser);

//get all the users
router.get("/all/:id", GetAllSuggestedUsers);

//send a friend request
router.post("/request/:reqSendBy/:reqSendTo", SendFriendRequest);

//cancel a friend request
router.post("/cancelrequest/:reqCancelBy/:reqCancelOf", CancelFriendRequest);

//get users who sent me friend request
router.get("/friendrequests/:id", GetAllFriendRequests);

//
router.post("/accept/:acceptedBy/:acceptedOf", AcceptFriendRequest);

//reject a friend request
router.post("/cancel/:cancelBy/:cancelOf", RejectIncomingFriendRequest);

//get my all friends
router.get("/myfriends/:id",GetMyAllFriends)


module.exports = router;
