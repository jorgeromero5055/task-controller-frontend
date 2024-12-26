import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
const httpLink = new HttpLink({
  uri: process.env.REACT_APP_BACKENDURL,
});

const getToken = () =>
  new Promise((resolve, reject) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      currentUser.getIdToken().then(resolve).catch(reject);
    } else {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          user.getIdToken().then(resolve).catch(reject);
        } else {
          resolve(null);
        }
      });
    }
  });

const authLink = setContext(async (_, { headers }) => {
  try {
    const token = await getToken();
    if (token) {
      return {
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
        },
      };
    } else {
      return { headers };
    }
  } catch (error) {
    return { headers };
  }
});

const link = ApolloLink.from([authLink, httpLink]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
