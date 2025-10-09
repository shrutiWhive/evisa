import { ApolloProvider as ApolloProviderBase } from "@apollo/client";

import apolloClient from "./apollo";

export function ApolloProvider({ children }) {
  return (
    <ApolloProviderBase client={apolloClient}>{children}</ApolloProviderBase>
  );
}
