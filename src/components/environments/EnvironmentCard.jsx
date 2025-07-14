import React from 'react';
import { FiGlobe, FiEdit, FiTrash2, FiCopy, FiCheck } from 'react-icons/fi';

const EnvironmentCard = ({ 
  environment, 
  isActive, 
  onSetActive, 
  onEdit, 
  onDelete, 
  onDuplicate 
}) => {
  const handleSetActive = () => {
    if (!isActive) {
      onSetActive(environment);
    }
  };

  return (
    <div className={`environment-card ${isActive ? 'active' : ''}`}>
      <div className="environment-header">
        <div className="environment-info">
          <div className="environment-title">
            <h3 className="environment-name">{environment.name}</h3>
            {isActive && (
              <span className="active-badge">
                <FiCheck />
                Active
              </span>
            )}
          </div>
          <div className="environment-url">{environment.baseUrl}</div>
          {environment.description && (
            <p className="environment-description">{environment.description}</p>
          )}
        </div>
        
        <div className="environment-actions">
          {!isActive && (
            <button
              className="action-btn"
              onClick={handleSetActive}
              title="Set as active environment"
            >
              <FiGlobe />
            </button>
          )}
          <button
            className="action-btn"
            onClick={() => onDuplicate(environment)}
            title="Duplicate environment"
          >
            <FiCopy />
          </button>
          <button
            className="action-btn"
            onClick={() => onEdit(environment)}
            title="Edit environment"
          >
            <FiEdit />
          </button>
          <button
            className="action-btn danger"
            onClick={() => onDelete(environment)}
            title="Delete environment"
            disabled={isActive}
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      <div className="environment-variables">
        <h4>Variables</h4>
        {Object.keys(environment.variables || {}).length > 0 ? (
          <div className="variables-summary">
            <div className="variables-count">
              {Object.keys(environment.variables).length} variables defined
            </div>
            <div className="variables-preview">
              {Object.entries(environment.variables).slice(0, 3).map(([key, value]) => (
                <div key={key} className="variable-item">
                  <span className="variable-key">{key}:</span>
                  <span className="variable-value">
                    {key.toLowerCase().includes('key') || 
                     key.toLowerCase().includes('token') || 
                     key.toLowerCase().includes('password') 
                      ? '••••••••' 
                      : value
                    }
                  </span>
                </div>
              ))}
              {Object.keys(environment.variables).length > 3 && (
                <div className="variable-more">
                  +{Object.keys(environment.variables).length - 3} more
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="no-variables">No variables defined</p>
        )}
      </div>

      <div className="environment-footer">
        <div className="environment-meta">
          <span className="meta-item">
            Created: {new Date(environment.createdAt).toLocaleDateString()}
          </span>
          {environment.updatedAt !== environment.createdAt && (
            <span className="meta-item">
              Updated: {new Date(environment.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnvironmentCard;