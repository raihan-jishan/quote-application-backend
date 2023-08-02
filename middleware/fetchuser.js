/*
    title: fetchuser.js file,
    desc: simple fetchuser middle-wear functions for application.
    date: 23 - 7 - 2023 
*/
// import all modules
const jwt = require("jsonwebtoken");
const JWT_SECRET = "hihellofrombangladesh";
// fetchuser fuction
const fetchuser = (req, res, next) => {
  //  get the user from teh jwt token and add id to req.object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using valid token!" });
  }
  // try cath function
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authencticate using valid token!" });
  }
};
// module export the file.
module.exports = fetchuser;
