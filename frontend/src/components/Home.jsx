

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import searchIcon from '../Assets/search.png';
import button1 from '../Assets/prev_query.png';
import button2 from '../Assets/new_query.png';
import folderIcon from '../Assets/folder.png';
import fileIcon from '../Assets/file-preview.png';
import moreOptionsIcon from '../Assets/more.png';
import OptionsMenu from './Options';

const isImage = (url) => /\.(jpg|jpeg|png|gif)$/i.test(url);

const Home = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [showAllFolders, setShowAllFolders] = useState(false);
  const [showAllFiles, setShowAllFiles] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedDocUrl, setSelectedDocUrl] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const optionsRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('user_id');

        const folderResponse = await fetch(`http://127.0.0.1:8000/user/${userId}/folders`);
        if (folderResponse.ok) {
          const folderData = await folderResponse.json();
          setFolders(folderData);
        }

        const fileResponse = await fetch(`http://127.0.0.1:8000/user/${userId}/documents`);
        if (fileResponse.ok) {
          const fileData = await fileResponse.json();
          setFiles(fileData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  
  const fetchPreviousChats = async () => {
    const userId = localStorage.getItem('user_id');
    try {
        const response = await fetch(`http://127.0.0.1:8000/user/${userId}/prev_chats`);
        if (!response.ok) {
            throw new Error('Failed to fetch previous chats');
        }
        const data = await response.json();
        navigate('/previous-queries', { state: { queries: data } });
    } catch (error) {
        console.error('Error fetching previous chats:', error);
        alert('Unable to load previous queries. Please try again later.');
    }
};

  
  const handleMoreOptionsClick = (event, docUrl) => {
    const { bottom, left } = event.currentTarget.getBoundingClientRect();
    setMenuPosition({ top: bottom + window.scrollY, left });
    setSelectedDocUrl(docUrl);
    setShowOptions(true);
  };

  const closeMenu = () => {
    setShowOptions(false);
    setSelectedDocUrl(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayedFolders = showAllFolders ? folders : folders.slice(0, 6);
  const displayedFiles = showAllFiles ? files : files.slice(0, 6);

  const getFileName = (url) => url.split('_').pop();

  const handleFolderClick = async (folderName) => {
    const userId = localStorage.getItem('user_id');
    try {
      const response = await fetch(`http://127.0.0.1:8000/documents/search-by-folder/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: parseInt(userId), foldername: folderName }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate('/files', { state: { files: data } });
      } else {
        console.error('Failed to fetch documents for folder');
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const menuItems = [
    {
      label: 'Add to Starred',
      icon: require('../Assets/starr.png'),
      action: async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/documents/mark-important/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: parseInt(localStorage.getItem('user_id')), doc_url: selectedDocUrl }),
          });

          if (response.ok) {
            alert('Document marked as important successfully');
          } else {
            console.error('Error marking document as important:', await response.json());
          }
        } catch (error) {
          console.error('Error marking document as important:', error);
        }
        closeMenu();
      },
    },
    {
      label: 'Rename file',
      icon: require('../Assets/rename.png'),
      action: () => {
        alert('Rename functionality to be implemented');
        closeMenu();
      },
    },
    {
      label: 'Download',
      icon: require('../Assets/download.png'),
      action: () => {
        window.open(selectedDocUrl, '_blank');
        closeMenu();
      },
    },
    {
      label: 'Move to Trash',
      icon: require('../Assets/delete.png'),
      action: async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/documents/move-trash/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: parseInt(localStorage.getItem('user_id')), doc_url: selectedDocUrl }),
          });

          if (response.ok) {
            alert('Document moved to trash successfully');
          } else {
            console.error('Error moving document to trash:', await response.json());
          }
        } catch (error) {
          console.error('Error moving document to trash:', error);
        }
        closeMenu();
      },
    },
  ];

  return (
    <div className="home">
      <div className="search-bar-container">
        <div className="search-bar">
          <img src={searchIcon} alt="Search Icon" className="search-icon" />
          <input type="text" placeholder="Search for a file" className="search-input" />
        </div>
        <div className="buttons">
          <img
            src={button1}
            alt="Previous Query"
            className="button-icon"
            onClick={fetchPreviousChats}
          />
          <img src={button2} alt="New Query" className="button-icon" onClick={() => navigate('/chatbot')} />
        </div>
      </div>

      {/* Folders Section */}
      <h2 className="section-title">
        Folders
        <span className="view-all" onClick={() => setShowAllFolders(!showAllFolders)}>
          {showAllFolders ? 'Show Less' : 'View All'}
        </span>
      </h2>
      <div className="folder-grid">
        {displayedFolders.map((folder, index) => (
          <div
            key={index}
            className="folder-card"
            onClick={() => handleFolderClick(folder.foldername)}
          >
            <div className="folder-icon">
              <img src={folderIcon} alt="Folder Icon" />
            </div>
            <div className="folder-content">
              <h4 className="folder-title">{folder.foldername}</h4>
              <div className="folder-details">
                <span className="folder-date">{folder.timestamp}</span>
                <span className="dot">•</span>
                <span className="folder-files">{folder.count} files</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Files Section */}
      <h2 className="section-title">
        Recent Files
        <span className="view-all" onClick={() => setShowAllFiles(!showAllFiles)}>
          {showAllFiles ? 'Show Less' : 'View All'}
        </span>
      </h2>
      <div className="file-grid">
        {displayedFiles.map((file, index) => (
          <div key={index} className="file-card">
            <div className="file-thumbnail">
              <a href={file.document_url} target="_blank" rel="noopener noreferrer">
                {isImage(file.document_url) ? (
                  <img src={file.document_url} alt="File Thumbnail" className="file-thumbnail" />
                ) : (
                  <img src={fileIcon} alt="File Icon" className="file-thumbnail" />
                )}
              </a>
            </div>
            <div className="file-content">
              <h4 className="file-name">{getFileName(file.document_url)}</h4>
              <div className="file-details">
                <span className="file-date">{file.timestamp}</span>
                <img
                  src={moreOptionsIcon}
                  alt="More Options"
                  className="more-options-icon"
                  onClick={(e) => handleMoreOptionsClick(e, file.document_url)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {showOptions && (
        <div className="options-container" ref={optionsRef} style={{ top: menuPosition.top, left: menuPosition.left }}>
          <OptionsMenu menuItems={menuItems} onClose={closeMenu} />
        </div>
      )}
    </div>
  );
};

export default Home;
