import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit, FiMail, FiPhone, FiCalendar, FiClock, FiShield } from 'react-icons/fi';
// import { userService } from '../../services/userService';
import { formatDate, formatRelativeTime } from '../../utils/helpers';
import Loading from '../common/Loading';
import toast from 'react-hot-toast';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      // Mock user data - in real app: const user = await userService.getUser(id);
      const mockUser = {
        id: '1',
        firstName: 'Ankur',
        lastName: 'Saroj',
        email: 'ankursaroj6396@google.com',
        phone: '+91 6396595947',
        role: 'Admin',
        status: 'active',
        avatar: '',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-02-20T14:30:00Z',
        lastLogin: '2024-02-20T16:45:00Z',
        loginCount: 127,
        department: 'MMS',
        location: 'Chennai, India',
        bio: 'Senior API architect with 10+ years of experience in designing scalable systems.',
        permissions: ['read:apis', 'write:apis', 'delete:apis', 'manage:users'],
        recentActivity: [
          {
            id: '1',
            action: 'Created API',
            description: 'User Management API v1.0',
            timestamp: '2024-02-20T16:30:00Z'
          },
          {
            id: '2',
            action: 'Updated Schema',
            description: 'Modified User schema properties',
            timestamp: '2024-02-20T15:45:00Z'
          },
          {
            id: '3',
            action: 'Tested Endpoint',
            description: 'GET /users endpoint',
            timestamp: '2024-02-20T14:20:00Z'
          }
        ]
      };
      setUser(mockUser);
    } catch (error) {
      toast.error('Failed to fetch user details');
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = () => {
    navigate(`/users/${id}/edit`);
  };

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

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="error-page">
        <h1>User not found</h1>
        <p>The user you're looking for doesn't exist.</p>
        <button className="btn btn-primary" onClick={() => navigate('/users')}>
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="user-detail">
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <button 
              className="btn btn-ghost"
              onClick={() => navigate('/users')}
            >
              <FiArrowLeft />
              Back to Users
            </button>
            <div>
              <h1>{user.firstName} {user.lastName}</h1>
              <p>User Details</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={handleEditUser}>
              <FiEdit />
              Edit User
            </button>
          </div>
        </div>
      </div>

      <div className="user-profile">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
            ) : (
              <div className="avatar-placeholder">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="profile-info">
            <h2>{user.firstName} {user.lastName}</h2>
            <div className="profile-badges">
              <span 
                className="role-badge"
                style={{ backgroundColor: getRoleColor(user.role) }}
              >
                <FiShield />
                {user.role}
              </span>
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(user.status) }}
              >
                {user.status}
              </span>
            </div>
            {user.bio && <p className="profile-bio">{user.bio}</p>}
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{user.loginCount}</span>
              <span className="stat-label">Total Logins</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {formatRelativeTime(user.lastLogin)}
              </span>
              <span className="stat-label">Last Login</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {formatRelativeTime(user.createdAt)}
              </span>
              <span className="stat-label">Member Since</span>
            </div>
          </div>
        </div>

        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            Recent Activity
          </button>
          <button
            className={`tab ${activeTab === 'permissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('permissions')}
          >
            Permissions
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'overview' && (
            <div className="overview-content">
              <div className="info-sections">
                <div className="info-section">
                  <h3>Contact Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <FiMail className="info-icon" />
                      <div>
                        <span className="info-label">Email</span>
                        <span className="info-value">{user.email}</span>
                      </div>
                    </div>
                    {user.phone && (
                      <div className="info-item">
                        <FiPhone className="info-icon" />
                        <div>
                          <span className="info-label">Phone</span>
                          <span className="info-value">{user.phone}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="info-section">
                  <h3>Work Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <FiShield className="info-icon" />
                      <div>
                        <span className="info-label">Role</span>
                        <span className="info-value">{user.role}</span>
                      </div>
                    </div>
                    {user.department && (
                      <div className="info-item">
                        <div>
                          <span className="info-label">Department</span>
                          <span className="info-value">{user.department}</span>
                        </div>
                      </div>
                    )}
                    {user.location && (
                      <div className="info-item">
                        <div>
                          <span className="info-label">Location</span>
                          <span className="info-value">{user.location}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="info-section">
                  <h3>Account Details</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <FiCalendar className="info-icon" />
                      <div>
                        <span className="info-label">Created</span>
                        <span className="info-value">{formatDate(user.createdAt)}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <FiCalendar className="info-icon" />
                      <div>
                        <span className="info-label">Last Updated</span>
                        <span className="info-value">{formatDate(user.updatedAt)}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <FiClock className="info-icon" />
                      <div>
                        <span className="info-label">Last Login</span>
                        <span className="info-value">
                          {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="activity-content">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                {user.recentActivity?.length > 0 ? (
                  user.recentActivity.map(activity => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-info">
                        <div className="activity-action">{activity.action}</div>
                        <div className="activity-description">{activity.description}</div>
                      </div>
                      <div className="activity-time">
                        {formatRelativeTime(activity.timestamp)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-activity">
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="permissions-content">
              <h3>User Permissions</h3>
              <div className="permissions-list">
                {user.permissions?.length > 0 ? (
                  user.permissions.map(permission => (
                    <div key={permission} className="permission-item">
                      <span className="permission-name">{permission}</span>
                    </div>
                  ))
                ) : (
                  <div className="empty-permissions">
                    <p>No specific permissions assigned</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;