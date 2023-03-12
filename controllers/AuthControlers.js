const User = require('../models/User');
const bcrypt = require("bcrypt");

//=======================
const RegisterUser = async (req, res) => {
  try {
    //generate hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      profilePic: req.body.profilePic,
      password: hashedPassword,
    });
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ msg: error });

    console.log(error);
  }
};

//=======================
const LoginUser = async (req, res) => {
  try {
   
    const user = await User.findOne({ email: req.body.email });
 
    if(!user){
      return res.status(404).json("User Not Found");
    }
    // !user && res.status(404).json("User Not Found");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    console.log(!validPassword);
    if (!validPassword) {
      return res.status(400).json("invalid password");
    }
    res.status(200).json(user);
  } catch (error) {

    res.status(404).json({ msg: "Internal Error" });

  }
};

module.exports={ RegisterUser, LoginUser };