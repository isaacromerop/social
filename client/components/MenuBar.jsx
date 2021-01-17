import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Loading from "../components/Loading";
import { useQuery, gql } from "@apollo/client";

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
  const { data, loading, client, error } = useQuery(GET_USER);
  if (loading) return <Loading />;

  const logOut = () => {
    localStorage.removeItem("token");
    client.resetStore();
    client.clearStore();
  };

  return (
    <div className="ui pointing secondary menu massive teal">
      <Link href="/">
        <a className={router.pathname === "/" ? "active item" : "item"}>Home</a>
      </Link>
      <div className="right menu">
        <Link href="/login">
          <a className={router.pathname === "/login" ? "active item" : "item"}>
            Login
          </a>
        </Link>
        <Link href="/register">
          <a
            className={router.pathname === "/register" ? "active item" : "item"}
          >
            Register
          </a>
        </Link>
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
