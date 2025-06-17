import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import New from './components/New';
import Home from './components/Home';
import Categories from './components/Categories';
import Starred from './components/Starred';
import Trash from './components/Trash';
import PreviousQueries from './components/Previous';
import Chatbot from './components/Chatbot';
import SignIn from './components/Loginform';
import SignUp from './components/SignupForm';
import Files from './components/Files';
import PreChatbot from './components/PreChatbot';

import './App.css';

function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignIn = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="app">
      {/* Render Sidebar unless on Chatbot or PreChatbot routes */}
      {isAuthenticated &&
        location.pathname !== '/chatbot' &&
        location.pathname !== '/pre-chatbot' && <Sidebar />}

      <main className="content">
        <Routes>
          {/* Authentication Routes */}
          <Route path="/signin" element={<SignIn onSignIn={handleSignIn} />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes (accessible only if authenticated) */}
          {isAuthenticated ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/new" element={<New />} />
              <Route path="/categories" element={<Categories />} />

              {/* Routes for Starred and Trash */}
              <Route path="/star" element={<Starred />} />
              <Route path="/trash" element={<Trash />} />

              <Route path="/files" element={<Files />} />

              {/* Main routes */}
              <Route path="/previous-queries" element={<PreviousQueries />} />
              <Route path="/pre-chatbot" element={<PreChatbot />} />
              <Route path="/chatbot" element={<Chatbot />} />
            </>
          ) : (
            // Redirect to sign-in if not authenticated
            <Route path="*" element={<Navigate to="/signin" />} />
          )}
        </Routes>
      </main>
    </div>
  );
}

export default App;
