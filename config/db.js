const { AddArgumentsAsVariables } = require("apollo-server");
const mongoose = require("mongoose");
require("dotenv").config({ path: "variables.env" });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("Connected to socialDB");
  } catch (error) {
    console.log(`Could not connect with DB: ${error}`);
    process.exit(1);
  }
};

module.exports = connectDB;
