/*
    title: post.js file, 
    desc: post file for handle all blog posts.
    date: 23 - 11 - 23 .

*/
const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser.js");
const Post = require("../model/Post.js");
const User = require("../model/User.js");
const Blog = require("../model/Blog.js");
const { body, validationResult, check } = require("express-validator");
// Route (1) fetchallposts
router.get("/fetchallposts", async (req, res) => {
  // try cath
  try {
    const posts = await Post.find(req.query);
    res.status(201).json(posts);
  } catch (error) {
    res.status(500).send("Internal Server Error!");
  }
});
// Route (2) getcreatorposts
// get creator post's to find creators own posts..

router.get("/getcreatorposts", fetchuser, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error !");
  }
});
// Route (3) addpost
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
      const { title, description, imageUrl, tag } = req.body;
      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const post = new Post({
        title,
        description,
        imageUrl,
        tag,
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

// Route (4) updatepost
router.put("/updatepost/:id", fetchuser, async (req, res) => {
  const { title, description, imageUrl, tag } = req.body;
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
    if (tag) {
      newPost.tag = tag;
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
// Route (5) deletepost
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
// Route (6) likepost
router.put("/likepost/:id", fetchuser, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // if user already liked a post
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post already liked!" });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Internal Server Error!");
  }
});
// Route (7) comment a post
router.post(
  "/comment/:id",
  fetchuser,
  [check("text", "Text is required!")],
  async (req, res) => {
    const errors = validationResult(req);
    //  if statement
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findByIdAndUpdate(req.params.id);
      const newComment = {
        text: req.body.text,
        user: req.user.id,
      };
      post.comments.unshift(newComment);
      await post.save();
      res.json(post);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server Error!");
    }
  }
);
// Route (8) make blog post
router.post(
  "/addblog",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, imageUrl, personName } = req.body;
      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const blogPost = new Blog({
        title,
        description,
        imageUrl,
        personName,
        user: req.user.id,
      });
      //   savepost
      const savedPost = await blogPost.save();
      res.json(savedPost);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
// Route (9) fetchblogposts
router.get("/fetchblogposts", async (req, res) => {
  // try cath
  try {
    const blogPosts = await Blog.find(req.query);
    res.status(201).json(blogPosts);
  } catch (error) {
    res.status(500).send("Internal Server Error!");
  }
});
// module exports
module.exports = router;
