const router=require('express').Router();

const { PostMessage, GetConversationMessage } = require('../controllers/MessageControllers');

//add
router.post("/",PostMessage);

///get
router.get("/:conversationId",GetConversationMessage);

module.exports=router;