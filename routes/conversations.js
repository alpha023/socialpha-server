const router = require("express").Router();

const { CreateNewConversation, GetConversationOfTwoUsers, GetAllConversationsOfAUser } = require("../controllers/ConversationsControler");

//new conversation
router.post("/", CreateNewConversation );

//conv of a user
router.get("/:userId", GetAllConversationsOfAUser);

//get conversation of particular two users
router.get("/find/:id1/:id2",GetConversationOfTwoUsers);

module.exports = router;
