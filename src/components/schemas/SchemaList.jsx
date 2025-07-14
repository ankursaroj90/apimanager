import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiCopy } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import SearchBox from '../common/SearchBox';
import { useSearch } from '../../hooks/useSearch';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import schemaService from '../../services/schemaService'; // Assuming this is where your schema service is defined

const SchemaList = () => {
  const { apiId } = useParams();
  const navigate = useNavigate();
  const { schemas, deleteSchema, currentApi } = useApp();

  const apiSchemas = schemas.filter(schema => schema.apiId === apiId);

  const {
    searchTerm,
    filteredData: filteredSchemas,
    handleSearchChange
  } = useSearch({
    data: apiSchemas,
    searchFields: ['name', 'description', 'type'],
    minSearchLength: 0
  });

  const handleCreateSchema = () => {
    navigate(`/apis/${apiId}/schemas/new`);
  };

  const handleEditSchema = (schema) => {
    navigate(`/apis/${apiId}/schemas/${schema.id}`);
  };

  const handleViewSchema = (schema) => {
    navigate(`/apis/${apiId}/schemas/${schema.id}/view`);
  };

  const handleDeleteSchema = (schema) => {
    if (window.confirm(`Are you sure you want to delete "${schema.name}"?`)) {
      deleteSchema(schema.id);
      //call the service to delete the schema from the db
      schemaService.deleteSchema(apiId, schema.id)
      toast.success('Schema deleted successfully');
    }
  };

  const handleCloneSchema = (schema) => {
    // In real app, this would clone the schema
    toast.success('Schema cloned successfully');
  };

  const getTypeColor = (type) => {
    const colors = {
      object: '#3b82f6',
      array: '#10b981',
      string: '#f59e0b',
      integer: '#8b5cf6',
      number: '#06b6d4',
      boolean: '#ef4444'
    };
    return colors[type] || '#6b7280';
  };

  return (
    <div className="schema-list">
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Schemas</h1>
            <p>{currentApi ? `${currentApi.name} API` : 'API Schemas'}</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={handleCreateSchema}>
              <FiPlus />
              Add Schema
            </button>
          </div>
        </div>
      </div>

      <div className="schema-controls">
        <SearchBox
          placeholder="Search schemas..."
          value={searchTerm}
          onSearch={handleSearchChange}
        />
      </div>

      <div className="schemas-grid">
        {filteredSchemas.map(schema => (
          <div key={schema.id} className="schema-card">
            <div className="schema-header">
              <div className="schema-info">
                <h3 className="schema-name">{schema.name}</h3>
                <span 
                  className="type-badge"
                  style={{ backgroundColor: getTypeColor(schema.type) }}
                >
                  {schema.type}
                </span>
              </div>
              <div className="schema-actions">
                <button
                  className="action-btn"
                  onClick={() => handleViewSchema(schema)}
                  title="View schema"
                >
                  <FiEye />
                </button>
                <button
                  className="action-btn"
                  onClick={() => handleEditSchema(schema)}
                  title="Edit schema"
                >
                  <FiEdit />
                </button>
                <button
                  className="action-btn"
                  onClick={() => handleCloneSchema(schema)}
                  title="Clone schema"
                >
                  <FiCopy />
                </button>
                <button
                  className="action-btn danger"
                  onClick={() => handleDeleteSchema(schema)}
                  title="Delete schema"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>

            <div className="schema-content">
              {schema.description && (
                <p className="schema-description">{schema.description}</p>
              )}
              
              <div className="schema-properties">
                {schema.properties && Object.keys(schema.properties).length > 0 ? (
                  <div className="properties-summary">
                    <span className="properties-count">
                      {Object.keys(schema.properties).length} properties
                    </span>
                    <div className="property-list">
                      {Object.entries(schema.properties).slice(0, 3).map(([key, prop]) => (
                        <span key={key} className="property-item">
                          {key}: {prop.type}
                        </span>
                      ))}
                      {Object.keys(schema.properties).length > 3 && (
                        <span className="property-more">
                          +{Object.keys(schema.properties).length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="no-properties">No properties defined</span>
                )}
              </div>

              {schema.required && schema.required.length > 0 && (
                <div className="required-fields">
                  <span className="required-label">Required:</span>
                  <span className="required-count">{schema.required.length} fields</span>
                </div>
              )}
            </div>

            <div className="schema-footer">
              <div className="schema-dates">
                <span className="date-label">Updated:</span>
                <span className="date-value">
                  {formatDate(schema.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSchemas.length === 0 && (
        <div className="empty-state">
          <FiPlus className="empty-icon" />
          <h3>No schemas found</h3>
          <p>
            {searchTerm
              ? 'No schemas match your search criteria'
              : 'Start building your API by defining data schemas'
            }
          </p>
          {!searchTerm && (
            <button className="btn btn-primary" onClick={handleCreateSchema}>
              <FiPlus />
              Add Your First Schema
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SchemaList;