import React from 'react';
import { FiEye, FiEdit, FiTrash2, FiMail, FiPhone } from 'react-icons/fi';
import { formatRelativeTime } from '../../utils/helpers';

const UserCard = ({ user, onView, onEdit, onDelete }) => {
  const getRoleColor = (role) => {
    const colors = {
      Admin: '#ef4444',
      Developer: '#3b82f6',
      Viewer: '#10b981',
      Manager: '#f59e0b'
    };
    return colors[role] || '#6b7280';
  };

  const getStatusColor = (status) => {
    return status === 'active' ? '#10b981' : '#6b7280';
  };

  return (
    <div className="user-card">
      <div className="user-card-header">
        <div className="user-avatar">
          {user.avatar ? (
            <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
          ) : (
            <div className="avatar-placeholder">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
          )}
        </div>
        <div className="user-actions">
          <button
            className="action-btn"
            onClick={() => onView(user)}
            title="View user"
          >
            <FiEye />
          </button>
          <button
            className="action-btn"
            onClick={() => onEdit(user)}
            title="Edit user"
          >
            <FiEdit />
          </button>
          <button
            className="action-btn danger"
            onClick={() => onDelete(user)}
            title="Delete user"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      <div className="user-card-content">
        <h3 className="user-name">{user.firstName} {user.lastName}</h3>
        
        <div className="user-badges">
          <span 
            className="role-badge"
            style={{ backgroundColor: getRoleColor(user.role) }}
          >
            {user.role}
          </span>
          <span 
            className="status-badge"
            style={{ backgroundColor: getStatusColor(user.status) }}
          >
            {user.status}
          </span>
        </div>

        <div className="user-contact">
          <div className="contact-item">
            <FiMail />
            <span>{user.email}</span>
          </div>
          {user.phone && (
            <div className="contact-item">
              <FiPhone />
              <span>{user.phone}</span>
            </div>
          )}
        </div>
      </div>

      <div className="user-card-footer">
        <div className="user-stats">
          <div className="stat-item">
            <span className="stat-label">Last Login:</span>
            <span className="stat-value">
              {user.lastLogin ? formatRelativeTime(user.lastLogin) : 'Never'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;