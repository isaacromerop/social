const Post = require("../models/Post");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
require("dotenv").config({ path: "variables.env" });

//create token function
const createToken = (user, secret, expiresIn) => {
  const { id, username } = user;
  return jwt.sign({ id, username }, secret, { expiresIn });
};

const resolvers = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find({});
        return posts;
      } catch (error) {
        console.log(error);
      }
    },
  },
  Mutation: {
    newUser: async (_, { input }) => {
      const { email, password, username } = input;
      //check if user exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        throw new Error("User already registered.");
      }
      //check if username is taken
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        throw new Error("Username not available.");
      }
      //hash password
      const salt = await bcryptjs.genSaltSync(10);
      input.password = bcryptjs.hashSync(password, salt);
      //save into DB
      try {
        const user = new User(input);
        user.save();
        user.token = createToken(user, process.env.SECRET, "24h");
        return user;
      } catch (error) {
        console.log(error);
      }
    },
    userAuth: async (_, { input }) => {
      const { email, password } = input;
      //check if user exists
      const userExists = await User.findOne({ email });
      if (!userExists) {
        throw new Error("User does not exists.");
      }
      //check if password match
      const correctPass = await bcryptjs.compare(password, userExists.password);
      if (!correctPass) {
        throw new Error("Incorrect password.");
      }
      //create token
      return {
        token: createToken(userExists, process.env.SECRET, "24h"),
      };
    },
  },
};
module.exports = resolvers;
