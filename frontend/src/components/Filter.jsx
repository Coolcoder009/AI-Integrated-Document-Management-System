// src/components/FilterPanel.jsx
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaTimes, FaCalendarAlt } from 'react-icons/fa';
import '../styles/Filter.css';

const FilterPanel = ({ isOpen, onClose }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <div className={`filter-panel ${isOpen ? 'open' : ''}`}>
      <div className="filter-panel-header">
        <h3>Filter</h3>
        <button className="filter-close-button" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <div className="filter-panel-content">
        <h3>Date updated</h3>
        <div className="filter-options">
          <label>
            <input type="radio" name="dateFilter" /> Last day
          </label>
          <label>
            <input type="radio" name="dateFilter" /> Last week
          </label>
          <label>
            <input type="radio" name="dateFilter" /> Last month
          </label>
          <label>
            <input type="radio" name="dateFilter" /> Last year
          </label>
          <label>
            <input type="radio" name="dateFilter" /> Custom range
          </label>
        </div>

        <div className="date-input-container">
          <label>Start date</label>
          <div className="date-picker">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="DD/MM/YYYY"
              dateFormat="dd/MM/yyyy"
              className="date-input"
            />
            <FaCalendarAlt className="calendar-icon" />
          </div>

          <label>End date</label>
          <div className="date-picker">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="DD/MM/YYYY"
              dateFormat="dd/MM/yyyy"
              className="date-input"
            />
            <FaCalendarAlt className="calendar-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
