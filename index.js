const express = require("express");
const cors = require("cors");
const multer=require('multer');
const path=require('path');
const app = express();

const {DB_URL}=require('./ServerConstants');



app.use("/images",express.static(path.join(__dirname,"public/images")));
//console.log(__dirname)
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
dotenv.config();



//middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("common"));

const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    console.log(file,"dest")
    cb(null,"./server/public/images");
  },
  filename:(req,file,cb)=>{
    console.log(req.body.name);
    cb(null,`${req.body.name}`);
  }
});

const upload=multer({storage:storage});
app.post("/api/upload",upload.single("file"),(req,res)=>{
  console.log(req.body.name);
  try {
    console.log("1");
    return res.status(200).json("File Uploaded SuccessFully");
  } catch (err) {
    console.log(err);
    res.status(500).json("internal error occured")
    
  }
})

//routes
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const { DB_URL } = require("./ServerConstants");
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts",require('./routes/posts'));
app.use("/api/conversations",require('./routes/conversations'));
app.use("/api/messages",require('./routes/messages'));

//mongodb connection
mongoose.connect(`${DB_URL}`, {
  useNewUrlParser: true
});







app.listen(8000, () => {
  console.log("server Running on Port 800");
});
