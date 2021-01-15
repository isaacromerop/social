import { ApolloProvider } from "@apollo/client";
import client from "../config/apollo";
import "../styles/Styles.css";

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
