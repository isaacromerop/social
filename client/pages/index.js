import "semantic-ui-css/semantic.min.css";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import { useQuery, gql } from "@apollo/client";
import { Grid, Transition } from "semantic-ui-react";
import PostCard from "../components/PostCard";
import { useContext } from "react";
import UserContext from "../context/UserContext/UserContext";
import PostForm from "../components/PostForm";

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

export default function Home() {
  const { user } = useContext(UserContext);
  const { data, loading } = useQuery(GET_POSTS);
  if (loading) return <Loading />;
  return (
    <Layout>
      <Grid columns={3}>
        <Grid.Row className="page-title">
          <h1>Recent Posts</h1>
        </Grid.Row>
        <Grid.Row>
          {user && (
            <Grid.Column>
              <PostForm />
            </Grid.Column>
          )}
          <Transition.Group>
            {data.getPosts.map((post) => (
              <Grid.Column key={post.id} style={{ marginBottom: 30 }}>
                <PostCard post={post} />
              </Grid.Column>
            ))}
          </Transition.Group>
        </Grid.Row>
      </Grid>
    </Layout>
  );
}
