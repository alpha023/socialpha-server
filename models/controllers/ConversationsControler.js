const Conversation = require("../models/Conversation");


//=======================
 const CreateNewConversation=async (req, res) => {
    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });
    try {
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } catch (err) {
      res.status(500).json(err);
    }
  };

  //=======================
 const GetAllConversationsOfAUser=async (req, res) => {
    try {
      const conversation = await Conversation.find({
        members: { $in: [req.params.userId] },
      });
      
      res.status(200).json(conversation);
    } catch (err) {
      res.status(500).json(err);
    }
  };

  //=======================
const GetConversationOfTwoUsers=async (req,res)=>{

    try {
  
      const conversation=await Conversation.findOne({
        members:{
          $all :[req.params.id1,req.params.id2]
        }
      });
      res.status(200).json(conversation);
      
    } catch (err) {
  
      res.status(500).json(err);
      
    }
  
  };

  module.exports={ CreateNewConversation, GetConversationOfTwoUsers, GetAllConversationsOfAUser }