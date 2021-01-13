const { gql } = require("apollo-server");

const typeDefs = gql`
  type Comment {
    id: ID!
    body: String!
    username: String!
    created: String!
  }
  type Like {
    id: ID!
    username: String!
    created: String!
  }
  type Post {
    id: ID!
    body: String!
    username: String!
    created: String!
    comments: [Comment]
    likes: [Like]
    likesCount: Int!
    commentsCount: Int!
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
  input CreatePostInput {
    body: String!
  }
  input CommentInput {
    body: String!
  }

  type Query {
    #Post queries
    getPosts: [Post]
    getPost(id: ID!): Post
  }

  type Mutation {
    #Users mutations
    newUser(input: UserInput): User
    userAuth(input: AuthInput): Token
    #Posts mutations
    createPost(input: CreatePostInput): Post
    deletePost(id: ID!): String
    createComment(id: ID!, input: CommentInput): Post
    deleteComment(postId: ID!, commentId: ID!): Post
    likePost(id: ID!): Post
  }
`;

module.exports = typeDefs;
