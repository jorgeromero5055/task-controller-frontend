import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const httpLink = new HttpLink({ uri: 'http://192.168.1.153:4000/graphql' });

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
      console.log('Token:', token);
      return {
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
        },
      };
    } else {
      console.error('No token available.');
      return { headers };
      // throw new Error('No token available.');
    }
  } catch (error) {
    console.error('Error fetching token:', error);
    return { headers };
    // throw new Error('Error fetching token:', error);
  }
});

const link = ApolloLink.from([authLink, httpLink]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
