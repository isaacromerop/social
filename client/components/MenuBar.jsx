import React, { useContext } from "react";
import UserContext from "../context/UserContext/UserContext";
import Link from "next/link";
import { useRouter } from "next/router";
import Loading from "../components/Loading";
import { useQuery, gql } from "@apollo/client";
import Cookie from "js-cookie";

const GET_USER = gql`
  query getUser {
    getUser {
      id
      username
      email
    }
  }
`;

const MenuBar = () => {
  const router = useRouter();

  const { removeUser } = useContext(UserContext);

  const { data, loading, client } = useQuery(GET_USER);

  if (loading) {
    return <Loading />;
  }

  const logOut = () => {
    localStorage.removeItem("token");
    Cookie.remove("user");
    removeUser();
    client.resetStore();
  };

  return (
    <div className="ui pointing secondary menu massive teal">
      <Link href="/">
        <a className={router.pathname === "/" ? "active item" : "item"}>Home</a>
      </Link>
      <div className="right menu">
        {!data.getUser ? (
          <Link href="/login">
            <a
              className={router.pathname === "/login" ? "active item" : "item"}
            >
              Login
            </a>
          </Link>
        ) : null}

        {!data.getUser ? (
          <Link href="/register">
            <a
              className={
                router.pathname === "/register" ? "active item" : "item"
              }
            >
              Register
            </a>
          </Link>
        ) : null}

        {data.getUser ? (
          <a onClick={logOut} className="item" name="logout">
            Logout
          </a>
        ) : null}
      </div>
    </div>
  );
};

export default MenuBar;
