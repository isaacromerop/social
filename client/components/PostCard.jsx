import React, { useContext } from "react";
import { Card, Image, Button, Icon } from "semantic-ui-react";
import Router from "next/router";
import moment from "moment";
import UserContext from "../context/UserContext/UserContext";
import LikeButton from "../components/LikeButton";

const PostCard = ({ post }) => {
  const { user } = useContext(UserContext);
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
          <Card.Meta>{moment(post.created).fromNow()}</Card.Meta>
        </div>
        <Card.Description>{post.body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton
          likesCount={post.likesCount}
          id={post.id}
          user={user}
          likes={post.likes}
        />
        <Button
          basic
          size="tiny"
          color="blue"
          icon="comments"
          label={{
            basic: true,
            color: "blue",
            pointing: "left",
            content: post.commentsCount,
          }}
        />
        {user && user.username === post.username && (
          <Button size="tiny" as="div" color="red" floated="right">
            <Icon name="trash" style={{ margin: 0 }} />
          </Button>
        )}
      </Card.Content>
    </Card>
  );
};

export default PostCard;
