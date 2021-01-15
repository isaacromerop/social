import "semantic-ui-css/semantic.min.css";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";
import { Grid } from "semantic-ui-react";
import PostCard from "../components/PostCard";

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
  const { data, loading, client } = useQuery(GET_POSTS);
  const router = useRouter();
  if (loading) return <Loading />;
  console.log(data);
  if (!data.getPosts) {
    client.clearStore();
    router.push("/login");
    return <Loading />;
  }
  return (
    <Layout>
      <Grid columns={3}>
        <Grid.Row className="page-title">
          <h1>Recent Posts</h1>
        </Grid.Row>
        <Grid.Row>
          {data.getPosts.map((post) => (
            <Grid.Column key={post.id} style={{ marginBottom: 30 }}>
              <PostCard post={post} />
            </Grid.Column>
          ))}
        </Grid.Row>
      </Grid>
    </Layout>
  );
}
