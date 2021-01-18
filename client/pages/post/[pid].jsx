import React, { useContext } from "react";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";
import Loading from "../../components/Loading";
import { Button, Card, Grid, Icon, Image, Label } from "semantic-ui-react";
import LikeButton from "../../components/LikeButton";
import DeleteButton from "../../components/DeleteButton";
import UserContext from "../../context/UserContext/UserContext";
import moment from "moment";
import Layout from "../../components/Layout";

const GET_POST = gql`
  query getPost($id: ID!) {
    getPost(id: $id) {
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
      username
      likesCount
      commentsCount
    }
  }
`;

const Comment = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const {
    query: { id },
  } = router;
  const { data, loading } = useQuery(GET_POST, {
    variables: {
      id,
    },
  });
  if (loading) return <Loading />;
  return (
    <Layout>
      <Grid>
        <Grid.Column width={2}>
          <Image
            floated="right"
            src="https://react.semantic-ui.com/images/avatar/large/molly.png"
          />
        </Grid.Column>
        <Grid.Column width={10}>
          <Card fluid>
            <Card.Content>
              <Card.Header>{data.getPost.username}</Card.Header>
              <Card.Meta>{moment(data.getPost.created).fromNow()}</Card.Meta>
              <Card.Description>{data.getPost.body}</Card.Description>
            </Card.Content>
            <hr />
            <Card.Content extra>
              <LikeButton
                user={user}
                likes={data.getPost.likes}
                id={id}
                likesCount={data.getPost.likesCount}
              />
              <Button as="div" labelPosition="right">
                <Button size="tiny" basic color="blue">
                  <Icon name="comments" />
                </Button>
                <Label basic color="blue" pointing="left">
                  {data.getPost.commentsCount}
                </Label>
              </Button>
              {user && user.username === data.getPost.username && (
                <DeleteButton id={id} />
              )}
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    </Layout>
  );
};

export default Comment;
