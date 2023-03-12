const router = require("express").Router();
const { RegisterUser, LoginUser } = require("../controllers/AuthControlers");

router.get("/", (_, res) => {
  res.send("Hey Its auth route");
});

//register a user
router.post("/register",RegisterUser );

//login user
router.post("/login",LoginUser );

module.exports = router;
