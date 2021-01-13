const Post = require("../models/Post");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { isValidObjectId } = require("mongoose");
require("dotenv").config({ path: "variables.env" });

//create token function
const createToken = (user, secret, expiresIn) => {
  const { id, username, email } = user;
  return jwt.sign({ id, username, email }, secret, { expiresIn });
};

const resolvers = {
  Post: {
    likesCount: (parents) => {
      return parents.likes.length;
    },
    commentsCount: (parents) => {
      return parents.comments.length;
    },
  },
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find({}).sort({ created: -1 });
        return posts;
      } catch (error) {
        console.log(error);
      }
    },
    getPost: async (_, { id }) => {
      //check if post exists
      if (!isValidObjectId(id)) {
        throw new Error("Post not found.");
      }
      const post = await Post.findById(id);
      if (!post) {
        throw new Error("Post does not exists.");
      }
      return post;
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
        await user.save();
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
    createPost: async (_, { input }, ctx) => {
      const { body } = input;
      const newPost = new Post({
        body,
        user: ctx.user.id,
        username: ctx.user.username,
      });
      try {
        const post = await newPost.save();
        return post;
      } catch (error) {
        console.log(error);
      }
    },
    deletePost: async (_, { id }, ctx) => {
      //check if post exists
      if (!isValidObjectId(id)) {
        throw new Error("Post not found.");
      }
      const post = await Post.findById(id);
      if (!post) {
        throw new Error("Post does not exists.");
      }
      //check if user is the owner of the post
      if (ctx.user.id.toString() !== post.user.toString()) {
        throw new Error("Permissions required to delete post.");
      }
      await Post.findOneAndDelete({ _id: id });
      return "Post deleted.";
    },
    createComment: async (_, { id, input }, ctx) => {
      const { body } = input;
      //check if post exists
      if (!isValidObjectId(id)) {
        throw new Error("Post not found.");
      }
      const post = await Post.findById(id);
      if (!post) {
        throw new Error("Post does not exists.");
      }
      await post.comments.unshift({
        body,
        username: ctx.user.username,
      });
      await post.save();
      return post;
    },
    deleteComment: async (_, { postId, commentId }, ctx) => {
      //check if post exists
      if (!isValidObjectId(postId)) {
        throw new Error("Post not found.");
      }
      //check if comment exists
      if (!isValidObjectId(commentId)) {
        throw new Error("Comment not found.");
      }
      const post = await Post.findById(postId);
      if (!post) {
        throw new Error("Post does not exists.");
      }
      const commentIndex = post.comments.findIndex(
        (com) => com.id === commentId
      );
      if (commentIndex === -1) {
        throw new Error("Comment does not exists.");
      }
      if (post.comments[commentIndex].username !== ctx.user.username) {
        throw new Error("Permissions required to delete comment.");
      }
      post.comments.splice(commentIndex, 1);
      await post.save();
      return post;
    },
    likePost: async (_, { id }, ctx) => {
      //check if post exists
      if (!isValidObjectId(id)) {
        throw new Error("Post not found.");
      }
      const post = await Post.findById(id);
      if (!post) {
        throw new Error("Post does not exists.");
      }
      const likeIndex = post.likes.findIndex(
        (like) => like.username === ctx.user.username
      );
      if (likeIndex === -1) {
        //like post
        post.likes.push({
          username: ctx.user.username,
        });
      } else {
        //unlike post
        post.likes = post.likes.filter(
          (like) => like.username !== ctx.user.username
        );
      }
      await post.save();
      return post;
    },
  },
};
module.exports = resolvers;
