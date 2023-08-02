router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
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
        return res
          .status(400)
          .json({
            success,
            error: "Sorry a User with teh email already exist. ",
          });
      }
      // secPass variable
      const salt = await bcrypt.genSalt(10);
      const secPassword = await bcrypt.hash(req.body.password, salt);
      // user awilt check...
      user = await User.create({
        name: req.body.name,
        password: secPassword,
        email: req.body.email,
      });
      // data variables
      const data = {
        user: {
          id: user.id,
        },
      };
      // jwt auth token base works
      const authtoken = jwt.sign(data, JWT_SECRET);
      //  res json
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error !");
    }
  }
);
