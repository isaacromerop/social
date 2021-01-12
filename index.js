const { ApolloServer } = require("apollo-server");
const connectDB = require("./config/db");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

//connect with DB
connectDB();

//create apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

//start server
server.listen({ port: process.env.PORT || 4000 }).then((res) => {
  console.log(`Server running at URL: ${res.url}`);
});
