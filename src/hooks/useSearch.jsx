import { useState, useMemo, useCallback } from 'react';
import { debounce } from 'lodash';

export const useSearch = ({
  data = [],
  searchFields = [],
  minSearchLength = 1,
  debounceMs = 300,
  filterFn,
  sortFn
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  const debouncedSetSearchTerm = useCallback(
    debounce((term) => setSearchTerm(term), debounceMs),
    [debounceMs]
  );

  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search filter
    if (searchTerm && searchTerm.length >= minSearchLength) {
      const searchLower = searchTerm.toLowerCase();
      
      result = result.filter(item => {
        // If custom filter function is provided, use it
        if (filterFn) {
          return filterFn(item, searchTerm);
        }
        
        // Default search implementation
        return searchFields.some(field => {
          const value = getNestedValue(item, field);
          if (Array.isArray(value)) {
            return value.some(v => 
              String(v).toLowerCase().includes(searchLower)
            );
          }
          return String(value || '').toLowerCase().includes(searchLower);
        });
      });
    }

    // Apply additional filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        result = result.filter(item => {
          const itemValue = getNestedValue(item, key);
          if (Array.isArray(value)) {
            return value.includes(itemValue);
          }
          return itemValue === value;
        });
      }
    });

    // Apply sorting
    if (sortFn) {
      result.sort(sortFn);
    }

    return result;
  }, [data, searchTerm, filters, searchFields, minSearchLength, filterFn, sortFn]);

  const handleSearchChange = useCallback((term) => {
    debouncedSetSearchTerm(term);
  }, [debouncedSetSearchTerm]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    debouncedSetSearchTerm('');
  }, [debouncedSetSearchTerm]);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const clearAll = useCallback(() => {
    clearSearch();
    clearFilters();
  }, [clearSearch, clearFilters]);

  return {
    searchTerm,
    filters,
    filteredData,
    handleSearchChange,
    handleFilterChange,
    clearSearch,
    clearFilters,
    clearAll,
    resultCount: filteredData.length,
    hasActiveSearch: searchTerm.length >= minSearchLength,
    hasActiveFilters: Object.keys(filters).length > 0
  };
};

// Helper function to get nested object values
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : '';
  }, obj);
};

export default useSearch;