import React, { useState } from 'react';
import { FiSearch, FiX, FiFilter } from 'react-icons/fi';

const SearchBox = ({ 
  placeholder = "Search...", 
  value = "", 
  onSearch, 
  showFilters = false,
  filters = [],
  onFilterChange,
  className = ""
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  const handleClear = () => {
    onSearch('');
  };

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterChange = (filterKey, filterValue) => {
    const newFilters = { ...activeFilters, [filterKey]: filterValue };
    setActiveFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  return (
    <div className={`search-box ${className}`}>
      <div className="search-input-container">
        <FiSearch className="search-icon" />
        <input
          type="text"
          value={value}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          className="search-input"
        />
        {value && (
          <button className="clear-btn" onClick={handleClear}>
            <FiX />
          </button>
        )}
        {showFilters && (
          <button 
            className={`filter-btn ${isFilterOpen ? 'active' : ''}`}
            onClick={handleFilterToggle}
          >
            <FiFilter />
          </button>
        )}
      </div>

      {showFilters && isFilterOpen && (
        <div className="filter-panel">
          <div className="filter-header">
            <h4>Filters</h4>
            <button onClick={() => setActiveFilters({})}>Clear All</button>
          </div>
          <div className="filter-content">
            {filters.map((filter) => (
              <div key={filter.key} className="filter-group">
                <label className="filter-label">{filter.label}</label>
                {filter.type === 'select' && (
                  <select
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All</option>
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
                {filter.type === 'checkbox' && (
                  <div className="filter-checkboxes">
                    {filter.options?.map((option) => (
                      <label key={option.value} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={activeFilters[filter.key]?.includes(option.value) || false}
                          onChange={(e) => {
                            const currentValues = activeFilters[filter.key] || [];
                            const newValues = e.target.checked
                              ? [...currentValues, option.value]
                              : currentValues.filter(v => v !== option.value);
                            handleFilterChange(filter.key, newValues);
                          }}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBox;