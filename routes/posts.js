/*
    title: post.js file, 
    desc: post file for handle all blog posts.
    date: 23 - 7 - 23 .

*/
// require all import modules
const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser.js");
const Post = require("../model/Post.js");
const { body, validationResult } = require("express-validator");
// Route (1) fetchallposts
router.get("/fetchallposts", async (req, res) => {
  // try cath
  try {
    const posts = await Post.find();
    res.status(201).json(posts);
  } catch (error) {
    res.status(500).send("Internal Server Erro!");
  }
});
// Route (2) addpost
router.post(
  "/addpost",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, imageUrl } = req.body;
      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const post = new Post({
        title,
        description,
        likes: {},
        comments: [],
        imageUrl,
        user: req.user.id,
      });
      //   savepost
      const savedPost = await post.save();
      res.json(savedPost);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route (3) updatepost
router.put("/updatepost/:id", fetchuser, async (req, res) => {
  const { title, description, imageUrl } = req.body;
  // try catch
  try {
    const newPost = {};
    if (title) {
      // title
      newPost.title = title;
    }
    if (description) {
      // Description
      newPost.description = description;
    }
    if (imageUrl) {
      newPost.imageUrl = imageUrl;
    }
    // find the posts will be updated
    let post = await Post.findByIdAndUpdate(req.params.id);
    //   if !post
    if (!post) {
      return res.status(404).send("Not found!");
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed!");
    }
    post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: newPost },
      { new: true }
    );
    res.json({ post });
  } catch (error) {
    res.status(500).send("Internal Server Erro!");
  }
});
// Route (4) deletepost
router.delete("/deletepost/:id", fetchuser, async (req, res) => {
  // try cath funtion
  try {
    // find the post will be updated and deleted !
    let post = await Post.findByIdAndUpdate(req.params.id);
    // if else
    if (!post) {
      return res.status(404).send("Not Found!");
    }
    //   Allow to delete if this user own this post .
    if (post.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed!");
    }
    post = await Post.findByIdAndDelete(req.params.id);
    res.json({ Success: "Successful to delete this post", post: post });
  } catch (error) {
    res.status(500).send("Internal Server Erro!");
  }
});
// like posts function
const likePost = async (req, res) => {
  // try cath block
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);
    // if liked ?
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }
    // updatePost
    const updatePost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    // res status
    res.status(200).json(updatePost);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
// like route
router.patch("/:id/likes", likePost);

// module exports
module.exports = router;
