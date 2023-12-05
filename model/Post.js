/*
    title: Post model  file , 
    desc: this file for Post model of the mongodb.... 
    date: 26 - 11 - 2023. 
*/ 
const mongoose = require("mongoose"); // require mongoose connector
const { Schema } = require("mongoose");
const NotesSchema = new Schema({
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    reqired: true,
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      date:{
        type: Date,
        default: Date.now(), 
      },
    },
  ],
  imageUrl: {
    type: String,
    
  },
  tag: {
    type: String,
    // if these value provide accept the Post or return it...
    enum: {
      values: [
        "motivational",
        "Inspirational",
        "Positive",
        "Life",
        "Music",
        "Dreams",
        "Billionaire",
        "Legend",
        "Alone",
      ],
      message: `{Value } is not supported!`,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
}); 
module.exports = mongoose.model("notes", NotesSchema);
