import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import '../styles/FileViewer.css';
import moreOptionsIcon from '../Assets/more.png';
import searchIcon from '../Assets/search.png';
import fileIcon from '../Assets/file-preview.png';
import downloadIcon from '../Assets/download.png';
import starIcon from '../Assets/starr.png';
import unstarIcon from '../Assets/remove_star.png';
import deleteIcon from '../Assets/delete.png';
import restoreIcon from '../Assets/restore.png';

const FileViewer = ({ files = [], type = 'all' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [selectedDocUrl, setSelectedDocUrl] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const optionsRef = useRef(null);

  const isImage = (url) => /\.(jpg|jpeg|png|gif)$/i.test(url);

  const filteredFiles = files.filter((file) =>
    (file.document_url || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleOptionAction = async (action) => {
    const userId = localStorage.getItem('user_id');
    try {
      let endpoint = '';
      switch (action) {
        case 'star':
          endpoint = `/documents/mark-important/`;
          break;
        case 'unstar':
          endpoint = `/documents/remove-important/`;
          break;
        case 'delete':
          endpoint = `/documents/move-trash/`;
          break;
        case 'restore':
          endpoint = `/documents/restore/`;
          break;
        default:
          console.error('Unknown action:', action);
          return;
      }

      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: parseInt(userId, 10), doc_url: selectedDocUrl }),
      });

      if (response.ok) {
        alert(`${action} completed successfully.`);
      } else {
        console.error('Failed to perform action:', await response.json());
      }
    } catch (error) {
      console.error('Error performing action:', error);
    }
    closeMenu();
  };

  const options = [
    ...(type !== 'starred'
      ? [{ label: 'Star', icon: starIcon, action: () => handleOptionAction('star') }]
      : [{ label: 'Unstar', icon: unstarIcon, action: () => handleOptionAction('unstar') }]),
    { label: 'Download', icon: downloadIcon, action: () => window.open(selectedDocUrl, '_blank') },
    ...(type !== 'trash'
      ? [{ label: 'Delete', icon: deleteIcon, action: () => handleOptionAction('delete') }]
      : [{ label: 'Restore', icon: restoreIcon, action: () => handleOptionAction('restore') }]),
  ];

  return (
    <div className="file-viewer-container">
      <div className="search-bars">
        <img src={searchIcon} alt="Search Icon" className="search-icon" />
        <input
          type="text"
          placeholder="Search for a file"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="files-viewer">
        {filteredFiles.length > 0 ? (
          filteredFiles.map((file, index) => (
            <div key={index} className="files-card">
              <div className="files-thumbnail">
                <a href={file.document_url} target="_blank" rel="noopener noreferrer">
                  {isImage(file.document_url) ? (
                    <img src={file.document_url} alt="File Thumbnail" className="file-thumbnail" />
                  ) : (
                    <img src={fileIcon} alt="File Icon" className="file-thumbnail" />
                  )}
                </a>
              </div>
              <div className="files-info">
              <h4 className="files-name">{file.name || file.document_url.split('_').pop()}</h4>
                <div className="files-details">
                  <span className="files-date">{file.timestamp}</span>
                  <img
                    src={moreOptionsIcon}
                    alt="More Options"
                    className="more-options-icon"
                    onClick={(e) => handleMoreOptionsClick(e, file.document_url)}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-files">No files available.</div>
        )}
      </div>

      {showOptions && (
        <div
          className="options-container"
          style={{ top: menuPosition.top, left: menuPosition.left }}
          ref={optionsRef}
        >
          <div className="options-menu">
            {options.map((option, index) => (
              <div key={index} className="menu-item" onClick={option.action}>
                <img src={option.icon} alt={option.label} className="menu-icon" />
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

FileViewer.propTypes = {
  files: PropTypes.array,
  type: PropTypes.oneOf(['starred', 'trash', 'file']),
};

export default FileViewer;
