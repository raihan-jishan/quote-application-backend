/*
    title: Blog model  file , 
    desc: this file for Blog model of the mongodb.... 
    date: 26 - 11 - 2023. 
*/
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const BlogSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    reqired: true,
  },
  imageUrl: {
    type: String,
  },
  personName: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("blogs", BlogSchema);
