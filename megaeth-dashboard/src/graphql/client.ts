import { ApolloClient, InMemoryCache } from '@apollo/client';

export const apolloClient = new ApolloClient({
  uri: 'https://api.studio.thegraph.com/query/117912/mega-eth/v0.0.2',
  cache: new InMemoryCache(),
});