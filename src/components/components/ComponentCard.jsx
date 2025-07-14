import React from 'react';
import { FiEdit, FiTrash2, FiCopy, FiPackage } from 'react-icons/fi';
import { formatDate } from '../../utils/helpers';

const ComponentCard = ({ component, onEdit, onDelete, onClone }) => {
  const getTypeColor = (type) => {
    const colors = {
      schemas: '#3b82f6',
      responses: '#10b981',
      parameters: '#f59e0b',
      examples: '#8b5cf6',
      requestBodies: '#06b6d4',
      headers: '#ef4444',
      securitySchemes: '#6366f1'
    };
    return colors[type] || '#6b7280';
  };

  const getTypeLabel = (type) => {
    const labels = {
      schemas: 'Schema',
      responses: 'Response',
      parameters: 'Parameter',
      examples: 'Example',
      requestBodies: 'Request Body',
      headers: 'Header',
      securitySchemes: 'Security Scheme'
    };
    return labels[type] || type;
  };

  return (
    <div className="component-card">
      <div className="component-header">
        <div className="component-info">
          <div className="component-icon" style={{ backgroundColor: getTypeColor(component.type) }}>
            <FiPackage />
          </div>
          <div className="component-details">
            <h3 className="component-name">{component.name}</h3>
            <span className="component-type">{getTypeLabel(component.type)}</span>
          </div>
        </div>
        <div className="component-actions">
          <button
            className="action-btn"
            onClick={() => onEdit(component)}
            title="Edit component"
          >
            <FiEdit />
          </button>
          <button
            className="action-btn"
            onClick={() => onClone(component)}
            title="Clone component"
          >
            <FiCopy />
          </button>
          <button
            className="action-btn danger"
            onClick={() => onDelete(component)}
            title="Delete component"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      <div className="component-content">
        {component.description && (
          <p className="component-description">{component.description}</p>
        )}
        
        <div className="component-preview">
          <h5>Specification Preview</h5>
          <pre className="spec-preview">
            {JSON.stringify(component.specification, null, 2).substring(0, 200)}
            {JSON.stringify(component.specification, null, 2).length > 200 && '...'}
          </pre>
        </div>
      </div>

      <div className="component-footer">
        <div className="component-dates">
          <span className="date-label">Updated:</span>
          <span className="date-value">{formatDate(component.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ComponentCard;