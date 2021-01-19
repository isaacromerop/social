import React from "react";
import { Button, Popup } from "semantic-ui-react";
import { useMutation, gql } from "@apollo/client";

const LIKE_POST = gql`
  mutation likePost($id: ID!) {
    likePost(id: $id) {
      id
      likesCount
      body
      created
      username
      commentsCount
      likes {
        id
        created
        username
      }
      comments {
        id
        body
        created
        username
      }
    }
  }
`;
const GET_POSTS = gql`
  query getPosts {
    getPosts {
      id
      body
      likes {
        id
        username
        created
      }
      comments {
        id
        username
        body
        created
      }
      username
      created
      likesCount
      commentsCount
    }
  }
`;

const LikeButton = ({ likes, id, user, likesCount }) => {
  const [likePost] = useMutation(LIKE_POST);
  const likeThePost = async () => {
    try {
      const { data } = await likePost({
        variables: {
          id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Popup
      inverted
      content={
        user && likes.find((like) => like.username === user.username)
          ? "Unlike this post."
          : "Like this post."
      }
      trigger={
        <Button
          basic={
            user && likes.find((like) => like.username === user.username)
              ? false
              : true
          }
          size="tiny"
          icon="heart"
          color="teal"
          label={{
            basic: true,
            color: "teal",
            pointing: "left",
            content: likesCount,
          }}
          onClick={likeThePost}
        />
      }
    />
  );
};

export default LikeButton;
