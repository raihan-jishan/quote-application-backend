/*
    title: authentication related working file. 
    desc: a main file for login / logout / register all proccess.. 
    date: 23 - 11 - 2023. 
*/
const express = require("express");
const User = require("../model/User.js");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser.js");
const JWT_SECRET = "hihellofrombangladesh";
// route (1) createuser
router.post(
  "/createaccount",
  [
    body("name", "Enter a valid name").isLength({ min: 5 }),
    body("email", "Enter a valid a email").isEmail(),
    body("password", "Password must be atleast 5 charector").isLength({
      min: 5,
    }),
    body("imageUrl", "Please provide a image url"),
  ],
  async (req, res) => {
    let success = false;
    // if there are no error, return BAD request and the Error's
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    // check whether the user email  exist already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success,
          error: "Sorry a User with teh email already exist. ",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const secPassword = await bcrypt.hash(req.body.password, salt);
      // create a user 
      user = await User.create({
        name: req.body.name,
        password: secPassword,
        email: req.body.email,
        
      });
      user.save();
      // data variables
      const data = {
        user: {
          id: user.id,
        },
      }; 
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error !");
    }
  }
);
// route (2) login
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials",
        });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
// route (3) getuser
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error!");
  }
});
// module exports router
module.exports = router;
