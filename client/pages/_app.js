import { ApolloProvider } from "@apollo/client";
import client from "../config/apollo";
import "../styles/Styles.css";
import UserState from "../context/UserContext/UserState";

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <UserState>
        <Component {...pageProps} />
      </UserState>
    </ApolloProvider>
  );
}

export default MyApp;
