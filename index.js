const { ApolloServer, PubSub } = require("apollo-server");
const connectDB = require("./config/db");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

//connect with DB
connectDB();

//create a Publish Subscribe instance
const pubsub = new PubSub();

//create apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers["authorization"] || "";
    if (token) {
      try {
        const user = jwt.verify(
          token.replace("Bearer ", ""),
          process.env.SECRET
        );
        return {
          user,
        };
      } catch (error) {
        console.log(error);
      }
    }
  },
});

//start server
server.listen({ port: process.env.PORT || 4000 }).then((res) => {
  console.log(`Server running at URL: ${res.url}`);
});
