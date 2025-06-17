// src/AppWrapper.jsx

import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import App from './App';

const AppWrapper = () => {
  const location = useLocation();
  return <App location={location} />;
};

const Root = () => (
  <Router>
    <AppWrapper />
  </Router>
);

export default Root;
