import React from 'react';
import { render } from 'react-dom';
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  ApolloLink,
} from '@apollo/client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from '@apollo/client/link/error';

import '../scss/style.scss';
import App from './App';

const devMode = process.env.NODE_ENV === 'development';

// custom error handling, only logging errors atm
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    // do something with graphql error
    console.error({ graphQLErrors });
  }

  if (networkError) {
    // do something with network error
    console.error({ networkError });
  }
});

const httpLink = new HttpLink({
  uri: devMode
    ? `${window.location.origin}/graphql/`
    : `https://${process.env.HOSTNAME}/graphql`
});

const link = ApolloLink.from([
  errorLink,
  httpLink,
]);

const cache = new InMemoryCache({
  introspectionQueryResultData: {
    __schema: {
      types: []
    }
  }
});

const client = new ApolloClient({
  cache,
  link,
  resolvers: {},
});

cache.writeData({
  data: {
    showBurgerMenu: true,
    overlayFunc: null
  },
});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.querySelector('main')
);