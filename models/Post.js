const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId:{
        type:String,
        required:true
    },
    comments:{
        type:Array
    },
    desc:{
        type:String,
        required:500
    },
    img:{
        type:String
    },
    likes:{
        type:Array,
        default:[]
    }
    
  },

  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
