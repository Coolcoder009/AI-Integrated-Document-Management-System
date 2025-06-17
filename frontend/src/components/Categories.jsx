import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Categories.css';
import medicalIcon from '../Assets/med.png';
import insuranceIcon from '../Assets/ins.png';
import financeIcon from '../Assets/fin.png';
import utilityIcon from '../Assets/utility.png';
import legalIcon from '../Assets/legal.png';
import hotelIcon from '../Assets/rest.png';
import retailIcon from '../Assets/retail.png';
import othersIcon from '../Assets/doc-others.png';
import button1 from '../Assets/prev_query.png';
import button2 from '../Assets/new_query.png';


const categoryData = [
  { name: 'Medical', icon: medicalIcon, updatedDate: 'Oct 10, 2024', fileCount: 1},
  { name: 'Insurance', icon: insuranceIcon, updatedDate: 'Oct 12, 2024', fileCount: 1 },
  { name: 'Finance', icon: financeIcon, updatedDate: 'Oct 14, 2024', fileCount: 0 },
  { name: 'Utility', icon: utilityIcon, updatedDate: 'Oct 15, 2024', fileCount: 0 },
  { name: 'Legal', icon: legalIcon, updatedDate: 'Oct 16, 2024', fileCount: 1},
  { name: 'Hotel', icon: hotelIcon, updatedDate: 'Oct 15, 2024', fileCount: 0 },
  { name: 'Retail', icon: retailIcon, updatedDate: 'Oct 18, 2024', fileCount: 1 },
  { name: 'Others', icon: othersIcon, updatedDate: 'Oct 19, 2024', fileCount: 23 },
];



const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = async (categoryName) => {
    const userId = localStorage.getItem('user_id');

    try {
      const response = await fetch(`http://127.0.0.1:8000/documents/search-by-category/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: parseInt(userId), category: categoryName }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate('/files', { state: { files: data } }); // Pass files to Files component
      } else {
        console.error('Failed to fetch documents for category');
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };
  
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

  return (
    <div className="categories">
      {/* Title */}
      <h2 className="section-title">Categories</h2>

      {/* Categories Grid */}
      <div className="category-grid">
        {categoryData.map((category, index) => (
          <div
            key={index}
            className="category-card"
            onClick={() => handleCategoryClick(category.name)} // Add click handler
          >
            <div className="category-header">
              <img src={category.icon} alt={`${category.name} Icon`} className="category-icon" />
            </div>
            <h4 className="category-name">{category.name}</h4>
            <div className="category-details">
              <span className="updated-date">{category.updatedDate}</span>
              <span className="dot">•</span>
              <span className="file-count">{category.fileCount} files</span>
            </div>
          </div>
        ))}
      </div>

      {/* Persistent Buttons */}
      <div className="persistent-buttons">
        <img src={button1} alt="Previous Query" className="persistent-button" onClick={fetchPreviousChats} />
        <img src={button2} alt="New Query" className="persistent-button" onClick={() => navigate('/chatbot')} />
      </div>
    </div>
  );
};

export default Categories;
