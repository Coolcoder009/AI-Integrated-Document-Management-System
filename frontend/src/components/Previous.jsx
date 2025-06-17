import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Previous.css';
import searchIcon from '../Assets/search.png';
import filterIcon from '../Assets/filter.png';
import newQueryIcon from '../Assets/new_query.png';
import moreOptionsIcon from '../Assets/more.png';
import FilterPanel from './Filter';
import axios from 'axios';

const PreviousQueries = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const queries = location.state?.queries || [];

    const toggleFilterPanel = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const filteredQueries = queries.filter((query) =>
        query.chat_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleQueryClick = async (chatName) => {
        const userId = localStorage.getItem('user_id');
        try {
            const response = await axios.get("http://127.0.0.1:8000/get_chats_by_chatnames/", {
                params: { user_id: userId, chat_name: chatName },
            });
    
            const { chat_name, items } = response.data;
    
            const processedItems = items.map((item) => ({
                ...item,
                type: item.type || (item.url ? 'document' : 'chat'),
            }));
    
            navigate('/pre-chatbot', { state: { chatName: chat_name, initialItems: processedItems } });
        } catch (error) {
            console.error("Error fetching chat data:", error);
            alert("Failed to load chat details. Please try again.");
        }
    };
    

    

    return (
        <div className="previous-queries">
            <div className="top-bar">
                <div className="search-bar">
                    <img src={searchIcon} alt="Search Icon" className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search for a query"
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <img src={filterIcon} alt="Filter Icon" className="filter-icon" onClick={toggleFilterPanel} />
                </div>
                <div className="new-query-button">
                    <img src={newQueryIcon} alt="New Query Icon" onClick={() => navigate('/chatbot')} />
                </div>
            </div>

            <h2 className="section-title">Previous Queries</h2>
            <div className="query-list">
                {filteredQueries.length > 0 ? (
                    filteredQueries.map((query, index) => (
                        <div
                            key={index}
                            className="query-item"
                            onClick={() => handleQueryClick(query.chat_name)}
                        >
                            <div className="query-info">
                                <h3 className="query-title">{query.chat_name}</h3>
                                <span className="query-updated">Updated on {query.latest_timestamp}</span>
                            </div>
                            <img src={moreOptionsIcon} alt="More Options" className="more-options-icon" />
                        </div>
                    ))
                ) : (
                    <div className="no-queries">No previous queries available.</div>
                )}
            </div>

            {/* Filter Panel */}
            <FilterPanel isOpen={isFilterOpen} onClose={toggleFilterPanel} />
        </div>
    );
};

export default PreviousQueries;
