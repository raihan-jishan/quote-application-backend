/*
    title: PostType.js file, 
    desc: simple file for schema types of postes .. 
    date: 25 - 7 - 2023. 
*/
// require all modules
const mongoose = require("mongoose"); // require mongoose connector
const { Schema } = require("mongoose");
const NotesSchema = new Schema({
  // user module
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
  likes: {
    type: Map,
    of: Boolean,
  },
  comments: {
    type: Array,
    default: [],
  },
  imageUrl: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1517061493161-6f312d1c36d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG5ld3MlMjBwYXBlciUyMGJsdXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
// export the module
module.exports = mongoose.model("notes", NotesSchema);
