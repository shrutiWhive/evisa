import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { CONFIG } from "src/global-config";

import { getUserToken } from "./utils";

const httpLink = new HttpLink({
  uri: `${CONFIG.assetsDir}graphql`,
});

const authLink = setContext((_, { headers }) => {
  const token = getUserToken();

  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  };
});

const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default apolloClient;
