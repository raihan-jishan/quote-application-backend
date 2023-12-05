/*
    title: db.js file, 
    desc: simple database connection file to connect mongodb in atlas server. 
    date: 2 - 11 - 2023. 
*/
const mongoose = require("mongoose"); 
const dotenv = require("dotenv");
dotenv.config();
const mongooseUrl = process.env.MongoDb_Datebase;
mongoose.set("strictQuery", false)
// connect to mongoDB 
const connectToMongo = async () => {
  await mongoose.connect(mongooseUrl);
  try {
    console.log("Connected ");
  } catch (error) {
    console.log("failed to connect");
  }
};
module.exports = connectToMongo;
