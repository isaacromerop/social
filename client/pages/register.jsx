import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, gql } from "@apollo/client";
import { Form, Button, Message } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Layout from "../components/Layout";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const NEW_USER = gql`
  mutation newUser($input: UserInput) {
    newUser(input: $input) {
      id
      email
      created
      username
      token
    }
  }
`;

const Register = () => {
  const router = useRouter();
  const [newUser, { client }] = useMutation(NEW_USER);
  const [disabled, setDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Please enter your User Name."),
      email: Yup.string()
        .required("Please enter your email.")
        .email("Not a valid Email."),
      password: Yup.string()
        .required("You must set up a password.")
        .min(6, "Password must be at least 6 characters long."),
      confirmPassword: Yup.string().when("password", {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("password")],
          "Both password must be the same."
        ),
      }),
    }),
    onSubmit: async (values) => {
      setDisabled(true);
      try {
        const { data } = await newUser({
          variables: {
            input: {
              username: values.username,
              email: values.email,
              password: values.password,
            },
          },
        });
        Swal.fire(
          "Resgistered!",
          `Welcome ${data.newUser.username}`,
          "success"
        );
        const { token } = data.newUser;
        localStorage.setItem("token", token);
        client.resetStore();
        router.push("/");
        setDisabled(false);
      } catch (error) {
        console.log(error);
        setErrorMessage(error.message);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      }
    },
  });
  const showMessage = () => {
    return (
      <Message negative>
        <Message.Header>Oops!, something went wrong...</Message.Header>
        <p>{errorMessage}</p>
      </Message>
    );
  };
  return (
    <Layout>
      <div className="form-container">
        <form className="ui form" onSubmit={formik.handleSubmit}>
          <h1>Register</h1>
          {errorMessage && showMessage()}
          <Form.Input
            label="Username"
            placeholder="Username"
            name="username"
            type="text"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.username}
          />
          {formik.touched.username && formik.errors.username && (
            <Message negative>
              <Message.Header>
                Oops!, you are forgetting something...
              </Message.Header>
              <p>{formik.errors.username}</p>
            </Message>
          )}
          <Form.Input
            label="Email"
            placeholder="Email"
            name="email"
            type="email"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <Message negative>
              <Message.Header>
                Oops!, you are forgetting something...
              </Message.Header>
              <p>{formik.errors.email}</p>
            </Message>
          )}
          <Form.Input
            label="Password"
            placeholder="Password"
            name="password"
            type="password"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <Message negative>
              <Message.Header>
                Oops!, you are forgetting something...
              </Message.Header>
              <p>{formik.errors.password}</p>
            </Message>
          )}
          <Form.Input
            label="Confirm password"
            placeholder="Confirm password"
            name="confirmPassword"
            type="password"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <Message negative>
              <Message.Header>
                Oops!, you are forgetting something...
              </Message.Header>
              <p>{formik.errors.confirmPassword}</p>
            </Message>
          )}
          <Button disabled={disabled} type="submit" primary>
            Register
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
