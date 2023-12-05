/*
    title: User.js file, 
    desc; simple file for schema type of a perticular user.
    date: 25 - 11 - 2023. 
    */
const mongoose = require("mongoose");
const { Schema } = mongoose;
// UsersSchema
const UsersSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default:
      "https://t4.ftcdn.net/jpg/04/34/95/57/360_F_434955751_FQpZNPBbMCpiTzBiISwjUDWQA0oHXc2d.jpg",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const User = mongoose.model("user", UsersSchema); 
module.exports = User;
