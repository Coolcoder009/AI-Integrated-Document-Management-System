import React from 'react';
import '../styles/Options.css';

const Options = ({ docUrl, menuItems, onClose }) => {
  return (
    <div className="options-menu">
      {menuItems.map((item, index) => (
        <div
          key={index}
          className="menu-item"
          onClick={() => {
            item.action(docUrl); // Call the action with the document URL
            onClose(); // Close the menu
          }}
        >
          <img src={item.icon} alt={item.label} className="menu-icon" />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Options;
