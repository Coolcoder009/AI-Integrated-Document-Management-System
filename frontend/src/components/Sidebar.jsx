// src/components/Sidebar.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';
import logo from '../Assets/logo.png';
import userIcon from '../Assets/Avatar.png';
import caretIcon from '../Assets/Caret.png';
import NewOptions from './Upload';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNewOptions, setShowNewOptions] = useState(false);
  const [email, setEmail] = useState('');
  const newOptionsRef = useRef(null);

  const handleLogoClick = () => {
    navigate('/'); // Redirects to the Home route
  };
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (newOptionsRef.current && !newOptionsRef.current.contains(event.target)) {
        setShowNewOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleNewOptions = () => setShowNewOptions(!showNewOptions);

  // Fetch starred documents and navigate to Starred page
  const handleStarredClick = async () => {
    const userId = localStorage.getItem('user_id');
    try {
      const response = await fetch(`http://127.0.0.1:8000/user/${userId}/important-documents`);
      if (response.ok) {
        const data = await response.json();
        navigate('/star', { state: { starredFiles: data } });
      } else {
        console.error('Failed to fetch starred documents');
      }
    } catch (error) {
      console.error('Error fetching starred documents:', error);
    }
  };

  // Fetch trashed documents and navigate to Trash page
  const handleTrashClick = async () => {
    const userId = localStorage.getItem('user_id');
    try {
      const response = await fetch(`http://127.0.0.1:8000/user/${userId}/trash-documents`);
      if (response.ok) {
        const data = await response.json();
        navigate('/trash', { state: { trashedFiles: data } });
      } else {
        console.error('Failed to fetch trashed documents');
      }
    } catch (error) {
      console.error('Error fetching trashed documents:', error);
    }
  };

  const menuItems = [
    { name: 'New', path: '/new', icon: require('../Assets/new.png'), className: 'new' },
    { name: 'Home', path: '/', icon: require('../Assets/home.png') },
    { name: 'Categories', path: '/categories', icon: require('../Assets/category.png') },
    { name: 'Starred', path: '/star', icon: require('../Assets/star.png'), onClick: handleStarredClick },
    { name: 'Trash', path: '/trash', icon: require('../Assets/trash.png'), onClick: handleTrashClick },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="App Logo" className="logo-image" />
            <h2>DMS</h2>
      </div>

      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`sidebar-item ${item.className || ''} ${location.pathname === item.path ? 'active' : ''}`}
          >
            <Link 
              to={item.path} 
              className="sidebar-link" 
              onClick={item.name === 'New' ? (e) => {
                e.preventDefault(); 
                toggleNewOptions();
              } : item.onClick}
            >
              <img src={item.icon} alt={`${item.name} icon`} className="menu-icon" />
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      <div className="user-profile">
        <img src={userIcon} alt="User Icon" className="user-icon" />
        <div className="user-info">
          <span className="welcome-message">Welcome back</span>
          <span className="username">{email}</span>
        </div>
        <div className="caret-container">
          <div className="tooltip">Coming soon</div>
          <img src={caretIcon} alt="Caret Icon" className="caret-icon" />
          </div>
      </div>

      {showNewOptions && (
        <div ref={newOptionsRef}>
          <NewOptions onClose={() => setShowNewOptions(false)} />
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
