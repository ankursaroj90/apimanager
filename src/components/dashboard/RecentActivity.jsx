import React from 'react';
import { FiActivity, FiPlus, FiEdit, FiTrash2, FiPlay, FiEye } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { formatRelativeTime } from '../../utils/helpers';

const RecentActivity = () => {
  const { requestHistory } = useApp();

  // Mock recent activities - in real app, this would come from activity log
  const recentActivities = [
    {
      id: '1',
      type: 'api_created',
      action: 'Created API',
      description: 'User Management API v1.0',
      user: 'John Doe',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      icon: FiPlus,
      color: '#10b981'
    },
    {
      id: '2',
      type: 'endpoint_tested',
      action: 'Tested Endpoint',
      description: 'GET /users endpoint - 200 OK',
      user: 'Jane Smith',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      icon: FiPlay,
      color: '#3b82f6'
    },
    {
      id: '3',
      type: 'schema_updated',
      action: 'Updated Schema',
      description: 'Modified User schema properties',
      user: 'Mike Johnson',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      icon: FiEdit,
      color: '#f59e0b'
    },
    {
      id: '4',
      type: 'api_viewed',
      action: 'Viewed API',
      description: 'Product Management API documentation',
      user: 'Sarah Wilson',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      icon: FiEye,
      color: '#8b5cf6'
    },
    {
      id: '5',
      type: 'endpoint_deleted',
      action: 'Deleted Endpoint',
      description: 'Removed deprecated /old-users endpoint',
      user: 'John Doe',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      icon: FiTrash2,
      color: '#ef4444'
    }
  ];

  const getActivityTypeLabel = (type) => {
    const labels = {
      api_created: 'API Created',
      api_updated: 'API Updated',
      api_deleted: 'API Deleted',
      endpoint_created: 'Endpoint Created',
      endpoint_updated: 'Endpoint Updated',
      endpoint_deleted: 'Endpoint Deleted',
      endpoint_tested: 'Endpoint Tested',
      schema_created: 'Schema Created',
      schema_updated: 'Schema Updated',
      schema_deleted: 'Schema Deleted',
      api_viewed: 'API Viewed'
    };
    return labels[type] || type;
  };

  const recentRequests = requestHistory.slice(0, 5);

  return (
    <div className="recent-activity">
      <div className="activity-header">
        <div className="header-content">
          <FiActivity className="header-icon" />
          <div>
            <h3>Recent Activity</h3>
            <p>Latest actions and events</p>
          </div>
        </div>
      </div>

      <div className="activity-sections">
        <div className="activity-section">
          <h4>System Activity</h4>
          <div className="activity-list">
            {recentActivities.map(activity => {
              const IconComponent = activity.icon;
              return (
                <div key={activity.id} className="activity-item">
                  <div 
                    className="activity-icon"
                    style={{ backgroundColor: activity.color }}
                  >
                    <IconComponent />
                  </div>
                  
                  <div className="activity-content">
                    <div className="activity-main">
                      <span className="activity-action">{activity.action}</span>
                      <span className="activity-description">{activity.description}</span>
                    </div>
                    <div className="activity-meta">
                      <span className="activity-user">by {activity.user}</span>
                      <span className="activity-time">
                        {formatRelativeTime(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="activity-section">
          <h4>Recent Requests</h4>
          <div className="requests-list">
            {recentRequests.length > 0 ? (
              recentRequests.map(request => (
                <div key={request.id} className="request-item">
                  <div className="request-method">
                    <span 
                      className="method-badge"
                      style={{ 
                        backgroundColor: request.request.method === 'GET' ? '#10b981' :
                                        request.request.method === 'POST' ? '#3b82f6' :
                                        request.request.method === 'PUT' ? '#f59e0b' :
                                        request.request.method === 'DELETE' ? '#ef4444' : '#6b7280'
                      }}
                    >
                      {request.request.method}
                    </span>
                  </div>
                  
                  <div className="request-details">
                    <div className="request-url">
                      {new URL(request.request.url).pathname}
                    </div>
                    <div className="request-meta">
                      <span 
                        className="status-code"
                        style={{ 
                          color: request.response.status >= 200 && request.response.status < 300 ? '#10b981' :
                                 request.response.status >= 400 ? '#ef4444' : '#f59e0b'
                        }}
                      >
                        {request.response.status}
                      </span>
                      <span className="response-time">
                        {request.response.responseTime}ms
                      </span>
                      <span className="request-time">
                        {formatRelativeTime(request.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-requests">
                <p>No recent requests</p>
                <small>Test some endpoints to see activity here</small>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="activity-footer">
        <button className="btn btn-secondary btn-sm">
          View All Activity
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;