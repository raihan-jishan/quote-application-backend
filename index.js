/*
    title: app.js file , 
    desc: mian file for simple fact website backend starter file. 
    date: 23  - 7 - 2023.
*/
// required all node js / express.js all modules .
const express = require("express");
const connectToDatabase = require("./database/db.js");
const app = express(); // app scafholding method
const port = 5000; // defined the port number..
var cors = require("cors"); //Cross-origin resource sharing method
// app use methods
app.use(cors());
app.use(express.json());
// routes of the whole application .
// routes of the whole application .
app.use("/api/auth", require("./routes/auth.js"));
app.use("/api/post", require("./routes/posts.js"));
//  app listen
app.listen(port, () => {
  console.log(`app listening on http://localhost:${port}`);
});

connectToDatabase();
