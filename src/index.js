import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import './styles/Global.css';

const setDynamicCSSVariables = () => {
  const getThinScrollbarWidth = () => {
    const scrollDiv = document.createElement('div');
    scrollDiv.style.overflow = 'scroll';
    scrollDiv.style.width = '50px';
    scrollDiv.style.height = '50px';
    scrollDiv.style.visibility = 'hidden';
    scrollDiv.style.scrollbarWidth = 'thin'; // Apply thin scrollbar

    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);

    return scrollbarWidth;
  };

  const thinScrollbarWidth = getThinScrollbarWidth();
  document.documentElement.style.setProperty(
    '--scrollbar-width',
    `${thinScrollbarWidth}px`
  );

  console.log('Thin scrollbar width:', thinScrollbarWidth);
};

// Call this before rendering
setDynamicCSSVariables();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
