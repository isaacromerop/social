import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, gql } from "@apollo/client";
import { Form, Button, Message } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Layout from "../components/Layout";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import UserContext from "../context/UserContext/UserContext";
import jwt_decode from "jwt-decode";

const USER_AUTH = gql`
  mutation userAuth($input: AuthInput) {
    userAuth(input: $input) {
      token
    }
  }
`;

const Login = () => {
  const { logUser } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState(null);
  const router = useRouter();
  const [userAuth, { client }] = useMutation(USER_AUTH, {
    update(_, results) {
      const userDecoded = jwt_decode(results.data.userAuth.token);
      setUserInfo(userDecoded);
    },
  });
  const [disabled, setDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Please enter your email.")
        .email("Not a valid Email."),
      password: Yup.string().required("Please enter your password."),
    }),
    onSubmit: async (values) => {
      setDisabled(true);
      try {
        const { data } = await userAuth({
          variables: {
            input: {
              email: values.email,
              password: values.password,
            },
          },
        });
        const { token } = data.userAuth;
        localStorage.setItem("token", token);
        client.resetStore();
        Swal.fire("Logged In!", "Happy to have you back!", "success");
        setTimeout(() => {
          router.push("/");
        }, 1000);
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
  useEffect(() => {
    logUser(userInfo);
  }, [userInfo]);
  return (
    <Layout>
      <div className="form-container">
        <form className="ui form" onSubmit={formik.handleSubmit}>
          <h1>Login</h1>
          {errorMessage && showMessage()}
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
          <Button disabled={disabled} type="submit" primary>
            Log in
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
