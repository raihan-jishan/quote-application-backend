/*
    title: db.js file, 
    desc: simple database connection file to connect mongodb in atlas server. 
    date: 25 - 7 - 2023. 
*/
const mongoose = require("mongoose"); // require mongoose connector
// const mongooseURI =  process.env.MONGO_DB_URL // string uri
const mongooseUrl =
  "mongodb+srv://raihanjishan2131:FPRDBsZl2mbK7VBj@cluster0.zsxrxzf.mongodb.net/?retryWrites=true&w=majority";
// connect to mongo function
const connectToMongo = async () => {
  await mongoose
    .connect(mongooseUrl)
    .then(console.log("Connected "))
    .catch(console.log("failed to connect"));
};
// export the module
module.exports = connectToMongo;
