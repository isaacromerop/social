import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const MenuBar = () => {
  const router = useRouter();

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
        <a className="item" name="logout">
          Logout
        </a>
      </div>
    </div>
  );
};

export default MenuBar;
