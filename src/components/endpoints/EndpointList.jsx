import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiPlay, FiCopy, FiFilter } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import SearchBox from '../common/SearchBox';
import { useSearch } from '../../hooks/useSearch';
import toast from 'react-hot-toast';
import endpointService from '../../services/endpointService'

const EndpointList = () => {
  const { apiId } = useParams();
  const navigate = useNavigate();
  const { endpoints, deleteEndpoint, currentApi } = useApp();
  const [selectedMethod, setSelectedMethod] = useState('all');

  const apiEndpoints = endpoints.filter(endpoint => endpoint.apiId === apiId);

  const {
    searchTerm,
    filteredData: filteredEndpoints,
    handleSearchChange
  } = useSearch({
    data: apiEndpoints,
    searchFields: ['name', 'path', 'method', 'summary'],
    minSearchLength: 0
  });

  const finalEndpoints = selectedMethod === 'all' 
    ? filteredEndpoints 
    : filteredEndpoints.filter(endpoint => endpoint.method === selectedMethod);

  const handleCreateEndpoint = () => {
    navigate(`/apis/${apiId}/endpoints/new`);
  };

  const handleEditEndpoint = (endpoint) => {
    navigate(`/apis/${apiId}/endpoints/${endpoint.id}`);
  };

  const handleDeleteEndpoint = (endpoint) => {
    if (window.confirm(`Are you sure you want to delete "${endpoint.name}"?`)) {
      deleteEndpoint(endpoint.id);
      //call the service to delete the endpoint
      endpointService.deleteEndpoint(apiId, endpoint.id)
      toast.success('Endpoint deleted successfully');
    }
  };

  const handleTestEndpoint = (endpoint) => {
    navigate(`/request?endpoint=${endpoint.id}`);
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: '#10b981',
      POST: '#3b82f6',
      PUT: '#f59e0b',
      PATCH: '#8b5cf6',
      DELETE: '#ef4444'
    };
    return colors[method] || '#6b7280';
  };

  const methodCounts = apiEndpoints.reduce((acc, endpoint) => {
    acc[endpoint.method] = (acc[endpoint.method] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="endpoint-list">
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Endpoints</h1>
            <p>{currentApi ? `${currentApi.name} API` : 'API Endpoints'}</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={handleCreateEndpoint}>
              <FiPlus />
              Add Endpoint
            </button>
          </div>
        </div>
      </div>

      <div className="endpoint-controls">
        <div className="controls-left">
          <SearchBox
            placeholder="Search endpoints..."
            value={searchTerm}
            onSearch={handleSearchChange}
          />
        </div>

        <div className="controls-right">
          <div className="method-filter">
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
            >
              <option value="all">All Methods ({apiEndpoints.length})</option>
              {Object.entries(methodCounts).map(([method, count]) => (
                <option key={method} value={method}>
                  {method} ({count})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="endpoint-stats">
        {Object.entries(methodCounts).map(([method, count]) => (
          <div key={method} className="stat-card">
            <div 
              className="stat-icon"
              style={{ backgroundColor: getMethodColor(method) }}
            >
              {method}
            </div>
            <div className="stat-content">
              <div className="stat-value">{count}</div>
              <div className="stat-label">{method} Endpoints</div>
            </div>
          </div>
        ))}
      </div>

      <div className="endpoints-grid">
        {finalEndpoints.map(endpoint => (
          <div key={endpoint.id} className="endpoint-card">
            <div className="endpoint-header">
              <div className="endpoint-method">
                <span 
                  className="method-badge"
                  style={{ backgroundColor: getMethodColor(endpoint.method) }}
                >
                  {endpoint.method}
                </span>
              </div>
              <div className="endpoint-actions">
                <button
                  className="action-btn"
                  onClick={() => handleTestEndpoint(endpoint)}
                  title="Test endpoint"
                >
                  <FiPlay />
                </button>
                <button
                  className="action-btn"
                  onClick={() => handleEditEndpoint(endpoint)}
                  title="Edit endpoint"
                >
                  <FiEdit />
                </button>
                <button
                  className="action-btn danger"
                  onClick={() => handleDeleteEndpoint(endpoint)}
                  title="Delete endpoint"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>

            <div className="endpoint-content">
              <h3 className="endpoint-name">{endpoint.name}</h3>
              <div className="endpoint-path">{endpoint.path}</div>
              {endpoint.summary && (
                <p className="endpoint-summary">{endpoint.summary}</p>
              )}
            </div>

            <div className="endpoint-metadata">
              {endpoint.parameters && endpoint.parameters.length > 0 && (
                <div className="metadata-item">
                  <span className="metadata-label">Parameters:</span>
                  <span className="metadata-value">{endpoint.parameters.length}</span>
                </div>
              )}
              {endpoint.responses && (
                <div className="metadata-item">
                  <span className="metadata-label">Responses:</span>
                  <span className="metadata-value">
                    {Object.keys(endpoint.responses).length}
                  </span>
                </div>
              )}
            </div>

            {endpoint.tags && endpoint.tags.length > 0 && (
              <div className="endpoint-tags">
                {endpoint.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="endpoint-tag">{tag}</span>
                ))}
                {endpoint.tags.length > 3 && (
                  <span className="endpoint-tag-more">+{endpoint.tags.length - 3}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {finalEndpoints.length === 0 && (
        <div className="empty-state">
          <FiPlus className="empty-icon" />
          <h3>No endpoints found</h3>
          <p>
            {searchTerm || selectedMethod !== 'all'
              ? 'No endpoints match your criteria'
              : 'Start building your API by adding endpoints'
            }
          </p>
          {(!searchTerm && selectedMethod === 'all') && (
            <button className="btn btn-primary" onClick={handleCreateEndpoint}>
              <FiPlus />
              Add Your First Endpoint
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EndpointList;