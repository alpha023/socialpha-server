const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
      default:""
    },
    from: {
      type: String,
      max: 50,
      default:""
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
    friends:{
      type:Array,
      default:[]
    },
    requestSent:{
      type:Array,
      default:[]
    },
    requestGet:{
      type:Array,
      default:[]
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    profilePic: {
     type:String,
      default:''
    },
    coverPic: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
