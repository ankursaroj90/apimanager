import React from 'react';
import { FiEye, FiEdit, FiTrash2, FiCopy, FiDownload } from 'react-icons/fi';
import { formatDate } from '../../utils/helpers';

const {endpoints,schemas} = useApp();

num1=endpoints.filter(ep => ep.apiId === api.id);
num2=schemas.filter(ep => ep.apiId === api.id);

const ApiCard = ({
  api,
  onView, 
  onEdit, 
  onDelete, 
  onClone, 
  onExport 
}) => {
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
    <div className="api-card">
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
            onClick={() => onView(api)}
            title="View API"
          >
            <FiEye />
          </button>
          <button
            className="action-btn"
            onClick={() => onEdit(api)}
            title="Edit API"
          >
            <FiEdit />
          </button>
          <button
            className="action-btn"
            onClick={() => onClone(api)}
            title="Clone API"
          >
            <FiCopy />
          </button>
          <button
            className="action-btn"
            onClick={() => onExport(api)}
            title="Export API"
          >
            <FiDownload />
          </button>
          <button
            className="action-btn danger"
            onClick={() => onDelete(api)}
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
          <span className="metadata-label">Endpoints:</span>
          <span className="metadata-value">{num1.length}</span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">Schemas:</span>
          <span className="metadata-value">{num2.length}</span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">Base URL:</span>
          <span className="metadata-value">{api.baseUrl}</span>
        </div>
      </div>

      {api.tags && api.tags.length > 0 && (
        <div className="api-tags">
          {api.tags.slice(0, 3).map(tag => (
            <span key={tag} className="api-tag">{tag}</span>
          ))}
          {api.tags.length > 3 && (
            <span className="api-tag-more">+{api.tags.length - 3}</span>
          )}
        </div>
      )}

      <div className="api-footer">
        <div className="api-dates">
          <span className="date-label">Updated:</span>
          <span className="date-value">
            {formatDate(api.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ApiCard;