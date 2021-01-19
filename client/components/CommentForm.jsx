import React from "react";
import { useMutation, gql } from "@apollo/client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Button, Message } from "semantic-ui-react";

const CREATE_COMMENT = gql`
  mutation createComment($id: ID!, $input: CommentInput) {
    createComment(id: $id, input: $input) {
      id
      body
      created
      username
      likesCount
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

const CommentForm = ({ id }) => {
  const [createComment] = useMutation(CREATE_COMMENT);
  const formik = useFormik({
    initialValues: {
      body: "",
    },
    validationSchema: Yup.object({
      body: Yup.string().required("What is your comment?"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const { data } = await createComment({
          variables: {
            id,
            input: {
              body: formik.values.body,
            },
          },
        });
        resetForm();
      } catch (error) {
        console.log(error);
      }
    },
  });
  return (
    <Form onSubmit={formik.handleSubmit}>
      <h2>Comment this:</h2>
      <Form.Field>
        <Form.Input
          name="body"
          placeholder="Comment here..."
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
        <Button
          disabled={formik.values.body ? false : true}
          type="submit"
          color="teal"
          style={{ marginBottom: "10px" }}
        >
          Comment
        </Button>
      </Form.Field>
    </Form>
  );
};

export default CommentForm;
