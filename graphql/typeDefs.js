const { gql } = require("apollo-server");

const typeDefs = gql`
  type Comment {
    body: String
    username: String
    created: String
  }
  type Like {
    username: String
    created: String
  }
  type Post {
    id: ID!
    body: String!
    username: String!
    created: String!
  }
  type User {
    id: ID
    username: String
    email: String
    created: String
    token: String
  }
  type Token {
    token: String
  }

  input UserInput {
    username: String!
    password: String!
    # confirmPassword: String!
    email: String!
  }
  input AuthInput {
    email: String!
    password: String!
  }

  type Query {
    #Post queries
    getPosts: [Post]
  }

  type Mutation {
    #Users mutations
    newUser(input: UserInput): User
    userAuth(input: AuthInput): Token
  }
`;

module.exports = typeDefs;
