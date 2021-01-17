import React from "react";
import { useMutation, gql } from "@apollo/client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Button, Message } from "semantic-ui-react";

const CREATE_POST = gql`
  mutation createPost($input: CreatePostInput) {
    createPost(input: $input) {
      id
      body
      likes {
        id
        username
        created
      }
      created
      username
      comments {
        id
        body
        username
        created
      }
      likesCount
      commentsCount
    }
  }
`;
const GET_POSTS = gql`
  query getPosts {
    getPosts {
      id
      body
      created
      username
      likesCount
      commentsCount
      likes {
        id
        username
        created
      }
      comments {
        id
        body
        username
        created
      }
    }
  }
`;

const PostForm = () => {
  const [createPost] = useMutation(CREATE_POST, {
    update(cache, { data: { createPost } }) {
      //get the item from cache
      const { getPosts } = cache.readQuery({
        query: GET_POSTS,
      });
      //update cache with new info
      cache.writeQuery({
        query: GET_POSTS,
        data: {
          getPosts: [createPost, ...getPosts],
        },
      });
    },
  });
  const formik = useFormik({
    initialValues: {
      body: "",
    },
    validationSchema: Yup.object({
      body: Yup.string().required("What are you posting?"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const { data } = await createPost({
          variables: {
            input: {
              body: values.body,
            },
          },
        });
        resetForm({});
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <h2>Create a post:</h2>
      <Form.Field>
        <Form.Input
          name="body"
          placeholder="Post here..."
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.body}
        />
        {formik.touched.body && formik.errors.body && (
          <Message negative>
            <Message.Header>
              Oops!, you are forgetting something...
            </Message.Header>
            <p>{formik.errors.body}</p>
          </Message>
        )}
        <Button type="submit" color="teal" style={{ marginBottom: "10px" }}>
          Post
        </Button>
      </Form.Field>
    </Form>
  );
};

export default PostForm;
