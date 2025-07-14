import React, { useState } from 'react';
import { FiSearch, FiFilter, FiX, FiSliders } from 'react-icons/fi';

const ProductSearch = ({ onSearch, onFilter, totalProducts, categories = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    priceRange: '',
    stockStatus: ''
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handlePriceRangeChange = () => {
    const priceRangeString = priceRange.min || priceRange.max 
      ? `${priceRange.min || 0}-${priceRange.max || 'max'}`
      : '';
    handleFilterChange('priceRange', priceRangeString);
  };

  const clearFilters = () => {
    setFilters({ category: '', status: '', priceRange: '', stockStatus: '' });
    setPriceRange({ min: '', max: '' });
    onFilter({ category: '', status: '', priceRange: '', stockStatus: '' });
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length;

  return (
    <div className="product-search">
      <div className="search-container">
        <div className="main-search">
          <div className="search-input-group">
            <FiSearch className="search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search products by name, SKU, or description..."
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-search" onClick={clearSearch}>
                <FiX />
              </button>
            )}
          </div>

          <div className="search-actions">
            <button
              className={`filter-toggle ${showAdvancedFilters ? 'active' : ''}`}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <FiFilter />
              Filters
              {activeFiltersCount > 0 && (
                <span className="filter-count">{activeFiltersCount}</span>
              )}
            </button>

            <button
              className="advanced-toggle"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <FiSliders />
              Advanced
            </button>
          </div>
        </div>

        <div className="quick-filters">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="quick-filter"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="quick-filter"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="discontinued">Discontinued</option>
          </select>

          <select
            value={filters.stockStatus}
            onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
            className="quick-filter"
          >
            <option value="">All Stock</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {showAdvancedFilters && (
        <div className="advanced-filters">
          <div className="filters-header">
            <h4>Advanced Filters</h4>
            {activeFiltersCount > 0 && (
              <button className="clear-all-filters" onClick={clearFilters}>
                Clear All Filters
              </button>
            )}
          </div>

          <div className="filters-grid">
            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-range-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  onBlur={handlePriceRangeChange}
                />
                <span className="range-separator">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  onBlur={handlePriceRangeChange}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Product Status</label>
              <div className="checkbox-group">
                {['active', 'draft', 'discontinued'].map(status => (
                  <label key={status} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={(e) => {
                        const currentStatuses = filters.status.split(',').filter(Boolean);
                        const newStatuses = e.target.checked
                          ? [...currentStatuses, status]
                          : currentStatuses.filter(s => s !== status);
                        handleFilterChange('status', newStatuses.join(','));
                      }}
                    />
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Stock Status</label>
              <div className="checkbox-group">
                {[
                  { value: 'in-stock', label: 'In Stock' },
                  { value: 'low-stock', label: 'Low Stock' },
                  { value: 'out-of-stock', label: 'Out of Stock' }
                ].map(option => (
                  <label key={option.value} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.stockStatus.includes(option.value)}
                      onChange={(e) => {
                        const currentStatuses = filters.stockStatus.split(',').filter(Boolean);
                        const newStatuses = e.target.checked
                          ? [...currentStatuses, option.value]
                          : currentStatuses.filter(s => s !== option.value);
                        handleFilterChange('stockStatus', newStatuses.join(','));
                      }}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="filters-actions">
            <button className="btn btn-secondary" onClick={clearFilters}>
              Clear Filters
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAdvancedFilters(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      <div className="search-results-info">
        <span>Showing {totalProducts} products</span>
        {searchTerm && (
          <span className="search-term">for "{searchTerm}"</span>
        )}
        {activeFiltersCount > 0 && (
          <span className="active-filters">
            with {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} applied
          </span>
        )}
      </div>

      {activeFiltersCount > 0 && (
        <div className="active-filters-display">
          <span className="filters-label">Active filters:</span>
          <div className="filter-tags">
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              
              let displayValue = value;
              if (key === 'category') {
                const category = categories.find(c => c.id === value);
                displayValue = category ? category.name : value;
              }
              
              return (
                <div key={key} className="filter-tag">
                  <span>{key}: {displayValue}</span>
                  <button onClick={() => handleFilterChange(key, '')}>
                    <FiX />
                  </button>
                </div>
              );
            })}
            <button className="clear-all-btn" onClick={clearFilters}>
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;