import React from 'react';
import { FiPlay, FiEdit, FiTrash2, FiCopy } from 'react-icons/fi';
import { formatDate } from '../../utils/helpers';

const EndpointCard = ({ endpoint, onTest, onEdit, onDelete, onClone }) => {
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

  return (
    <div className="endpoint-card">
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
            onClick={() => onTest(endpoint)}
            title="Test endpoint"
          >
            <FiPlay />
          </button>
          <button
            className="action-btn"
            onClick={() => onEdit(endpoint)}
            title="Edit endpoint"
          >
            <FiEdit />
          </button>
          <button
            className="action-btn"
            onClick={() => onClone(endpoint)}
            title="Clone endpoint"
          >
            <FiCopy />
          </button>
          <button
            className="action-btn danger"
            onClick={() => onDelete(endpoint)}
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

      <div className="endpoint-footer">
        <div className="endpoint-dates">
          <span className="date-label">Updated:</span>
          <span className="date-value">{formatDate(endpoint.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default EndpointCard;