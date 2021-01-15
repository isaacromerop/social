import React from "react";
import { Card, Image, Button } from "semantic-ui-react";
import Router from "next/router";

const PostCard = ({ post }) => {
  const handleClick = (id) => {
    Router.push({
      pathname: "/post/[id]",
      query: { id },
    });
  };
  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{post.username}</Card.Header>
        <div style={{ cursor: "pointer" }} onClick={() => handleClick(post.id)}>
          <Card.Meta>{post.created}</Card.Meta>
        </div>
        <Card.Description>{post.body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div>
          <Button
            basic
            icon="heart"
            color="teal"
            label={{
              basic: true,
              color: "teal",
              pointing: "left",
              content: post.likesCount,
            }}
          />
          <Button
            basic
            color="blue"
            icon="comments"
            label={{
              basic: true,
              color: "blue",
              pointing: "left",
              content: post.commentsCount,
            }}
          />
        </div>
      </Card.Content>
    </Card>
  );
};

export default PostCard;
