import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiPlus, FiEdit, FiTrash2, FiEye, FiCopy, FiDownload, 
  FiUpload, FiFilter, FiGrid, FiList, FiSearch, FiCode,
  FiActivity, FiGlobe, FiDatabase, FiFileText 
} from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import SearchBox from '../common/SearchBox';
import Pagination from '../common/Pagination';
import { useSearch } from '../../hooks/useSearch';
import { usePagination } from '../../hooks/usePagination';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import apiService from '../../services/apiService';
import api from '../../services/api';

const ApiOverview = () => {
  const navigate = useNavigate();
  const { apis, endpoints,schemas, setCurrentApi, deleteApi, addApi, environments } = useApp();
  const [viewMode, setViewMode] = useState('grid');
  const [selectedApis, setSelectedApis] = useState([]);

  const {
    searchTerm,
    filteredData: filteredApis,
    handleSearchChange
  } = useSearch({
    data: apis,
    searchFields: ['name', 'description', 'tags'],
    minSearchLength: 0
  });

  const {
    currentPage,
    totalPages,
    goToPage
  } = usePagination({
    totalItems: filteredApis.length,
    itemsPerPage: 12
  });

  const currentPageApis = filteredApis.slice(
    currentPage * 12,
    (currentPage + 1) * 12
  );

  const handleCreateApi = () => {
    navigate('/apis/new');
  };

  const handleEditApi = (api) => {
    setCurrentApi(api);
    //edit the API
    navigate(`/apis/${api.id}/edit`);
  };

  const handleViewApi = (api) => {
    setCurrentApi(api);
    navigate(`/apis/${api.id}/endpoints`);
  };

  const handleDeleteApi = (api) => {
    if (window.confirm(`Are you sure you want to delete "${api.name}"?`)) {
      // Call the service to delete the API
      apiService.deleteApi(api.id);
      deleteApi(api.id);
      toast.success('API deleted successfully');
    }
  };

  const handleCloneApi = (api) => {
    const clonedApi = {
      ...api,
      id: Date.now().toString(),
      name: `${api.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    addApi(clonedApi);
    // const response = apiService.cloneApi(api.id, clonedApi.name);
    toast.success('API cloned successfully');
  };

  const handleExportApi = (api) => {

    //fetch endpoints and schemas for the API
    const apiEndpoints = endpoints.filter(ep => ep.apiId === api.id);
    const apiSchemas = schemas.filter(schema => schema.apiId === api.id);

    const openApiSpec = {
      openapi: '3.0.0',
      info: {
        title: api.name,
        version: api.version,
        description: api.description
      },
      tags: api.tags.map(tag => ({ name: tag })),
      servers: [
        {
          url: api.baseUrl
        }
      ],
      paths: {}, // You can populate paths here if needed
      components: {
        schemas: {}, // Map your schemas here
        responses: {},
        parameters: {}
      },
      createdAt: api.createdAt || new Date().toISOString(),
      updatedAt: api.updatedAt || new Date().toISOString(),
    };
    
    //prepare the export data
    apiEndpoints.forEach(endpoint => {
      const path = endpoint.path.startsWith('/') ? endpoint.path : `/${endpoint.path}`;
      if (!openApiSpec.paths[path]) {
        openApiSpec.paths[path] = {};
      }
      openApiSpec.paths[path][endpoint.method.toLowerCase()] = {
        summary: endpoint.summary,
        description: endpoint.description,
        tags: endpoint.tags,
        parameters: endpoint.parameters.map(param => ({
          name: param.name,
          in: param.in,
          required: param.required,
          schema: {
            type: param.type,
            format: param.format
          }
        })),
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object'
                }
              }
            }
          }
        }
      };
    });

    apiSchemas.forEach(schema => {
      openApiSpec.components.schemas[schema.name] = {
        type: schema.type,
        properties: schema.properties,
        required: schema.required || [],
        example: schema.example || {},
      };
    });

    const exportData = {
      openApiSpec,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${api.name.toLowerCase().replace(/\s+/g, '-')}-api.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    const colors = {
      active: '#10b981',
      beta: '#f59e0b',
      deprecated: '#ef4444',
      draft: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className="api-overview">
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1>API Overview</h1>
            <p>Manage and design your API contracts</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={() => {}}>
              <FiUpload />
              Import API
            </button>
            <button className="btn btn-primary" onClick={handleCreateApi}>
              <FiPlus />
              Create API
            </button>
          </div>
        </div>
      </div>

      <div className="api-controls">
        <div className="controls-left">
          <SearchBox
            placeholder="Search APIs..."
            value={searchTerm}
            onSearch={handleSearchChange}
            showFilters={true}
            filters={[
              {
                key: 'status',
                label: 'Status',
                type: 'select',
                options: [
                  { value: 'active', label: 'Active' },
                  { value: 'beta', label: 'Beta' },
                  { value: 'deprecated', label: 'Deprecated' },
                  { value: 'draft', label: 'Draft' }
                ]
              }
            ]}
          />
        </div>

        <div className="controls-right">
          <div className="view-mode-toggle">
            <button
              className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <FiGrid />
            </button>
            <button
              className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <FiList />
            </button>
          </div>
        </div>
      </div>

      <div className="api-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FiDatabase />
          </div>
          <div className="stat-content">
            <div className="stat-value">{apis.length}</div>
            <div className="stat-label">Total APIs</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiActivity />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {apis.filter(api => api.status === 'active').length}
            </div>
            <div className="stat-label">Active</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiCode />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {endpoints.length}
            </div>
            <div className="stat-label">Endpoints</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiGlobe />
          </div>
          <div className="stat-content">
            <div className="stat-value">{environments.length}</div>
            <div className="stat-label">Environments</div>
          </div>
        </div>
      </div>

      <div className={`api-grid ${viewMode}`}>
        {currentPageApis.map(api => (
          <div key={api.id} className="api-card">
            <div className="api-card-header">
              <div className="api-info">
                <h3 className="api-name">{api.name}</h3>
                <div className="api-badges">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(api.status) }}
                  >
                    {api.status}
                  </span>
                  <span className="version-badge">v{api.version}</span>
                </div>
              </div>
              <div className="api-actions">
                <button
                  className="action-btn"
                  onClick={() => handleViewApi(api)}
                  title="View API"
                >
                  <FiEye />
                </button>
                <button
                  className="action-btn"
                  onClick={() => handleEditApi(api)}
                  title="Edit API"
                >
                  <FiEdit />
                </button>
                <button
                  className="action-btn"
                  onClick={() => handleCloneApi(api)}
                  title="Clone API"
                >
                  <FiCopy />
                </button>
                <button
                  className="action-btn"
                  onClick={() => handleExportApi(api)}
                  title="Export API"
                >
                  <FiDownload />
                </button>
                <button
                  className="action-btn danger"
                  onClick={() => handleDeleteApi(api)}
                  title="Delete API"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>

            <div className="api-description">
              {api.description}
            </div>

            <div className="api-metadata">
              <div className="metadata-item">
                <FiCode className="metadata-icon" />
                <span className="metadata-label">Endpoints:</span>
                <span className="metadata-value">{endpoints.filter(ep => ep.apiId === api.id)?.length || 0}</span>
              </div>
              <div className="metadata-item">
                <FiFileText className="metadata-icon" />
                <span className="metadata-label">Schemas:</span>
                <span className="metadata-value">{schemas.filter(ep => ep.apiId === api.id)?.length?.length || 0}</span>
              </div>
              <div className="metadata-item">
                <FiGlobe className="metadata-icon" />
                <span className="metadata-label">Base URL:</span>
                <span className="metadata-value">{api.baseUrl}</span>
              </div>
            </div>

            <div className="api-tags">
              {api.tags?.slice(0, 3).map(tag => (
                <span key={tag} className="api-tag">{tag}</span>
              ))}
              {api.tags?.length > 3 && (
                <span className="api-tag-more">+{api.tags.length - 3}</span>
              )}
            </div>

            <div className="api-footer">
              <div className="api-dates">
                <span className="date-label">Updated:</span>
                <span className="date-value">
                  {formatDate(api.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredApis.length === 0 && (
        <div className="empty-state">
          <FiSearch className="empty-icon" />
          <h3>No APIs found</h3>
          <p>
            {searchTerm 
              ? `No APIs match your search criteria "${searchTerm}"`
              : 'Get started by creating your first API'
            }
          </p>
          {!searchTerm && (
            <button className="btn btn-primary" onClick={handleCreateApi}>
              <FiPlus />
              Create Your First API
            </button>
          )}
        </div>
      )}

      {filteredApis.length > 12 && (
        <Pagination
          totalItems={filteredApis.length}
          itemsPerPage={12}
          currentPage={currentPage}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
};

export default ApiOverview;