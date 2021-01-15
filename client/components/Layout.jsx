import React from "react";
import MenuBar from "./MenuBar";
import Head from "next/head";
import { Container } from "semantic-ui-react";

const Layout = ({ children }) => {
  return (
    <div>
      <Head>
        <title>Social Media Project</title>
        <link rel="icon" href="/socialnetwork.png" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css"
          integrity="sha512-oHDEc8Xed4hiW6CxD7qjbnI+B07vDdX7hEPTvn9pSZO1bcRqHp8mj9pyr+8RVC2GmtEfI2Bi9Ke9Ass0as+zpg=="
          crossOrigin="anonymous"
        />
      </Head>

      <Container>
        <MenuBar />
        <main>{children}</main>
      </Container>
    </div>
  );
};

export default Layout;
