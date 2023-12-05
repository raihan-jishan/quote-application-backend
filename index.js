/*
    title: app.js file , 
    desc: mian file for simple quote  website backend starter file. 
    date: 23  - 10 - 2023.
*/

const express = require("express");
const connectToDatabase = require("./database/db.js");
const app = express();
const port = 5000;
var cors = require("cors");
app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/auth.js"));
app.use("/api/post", require("./routes/posts.js"));

// error handeling route 404 page not found.
app.use((req, res, next) => {
  next("Requested url was not found!");
});
// error handeling route
app.use((err, res) => {
  if (err.message) {
    res.status(500).send(err.message);
  } else {
    res.status(500).send("There was an error!");
  }
});
app.listen(port, () => {
  console.log(`app listening on http://localhost:${port}`);
});

connectToDatabase();
