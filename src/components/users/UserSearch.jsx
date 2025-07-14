import React, { useState } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const UserSearch = ({ onSearch, onFilter, totalUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    department: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    setFilters({ role: '', status: '', department: '' });
    onFilter({ role: '', status: '', department: '' });
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  return (
    <div className="user-search">
      <div className="search-container">
        <div className="search-input-group">
          <FiSearch className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search users by name, email, or role..."
            className="search-input"
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => handleSearchChange('')}
            >
              <FiX />
            </button>
          )}
        </div>

        <button
          className={`filter-toggle ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FiFilter />
          Filters
          {activeFiltersCount > 0 && (
            <span className="filter-count">{activeFiltersCount}</span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-header">
            <h4>Filter Users</h4>
            {activeFiltersCount > 0 && (
              <button className="clear-filters" onClick={clearFilters}>
                Clear All
              </button>
            )}
          </div>

          <div className="filters-grid">
            <div className="filter-group">
              <label>Role</label>
              <select
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Developer">Developer</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Department</label>
              <select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
              >
                <option value="">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="search-results-info">
        <span>Showing {totalUsers} users</span>
      </div>
    </div>
  );
};

export default UserSearch;