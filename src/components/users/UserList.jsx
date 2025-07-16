import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiMail, FiPhone } from 'react-icons/fi';
import SearchBox from '../common/SearchBox';
import Pagination from '../common/Pagination';
import Loading from '../common/Loading';
import { useSearch } from '../../hooks/useSearch';
import { usePagination } from '../../hooks/usePagination';
// import { userService } from '../../services/userService';
import toast from 'react-hot-toast';

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const {
    searchTerm,
    filteredData: filteredUsers,
    handleSearchChange
  } = useSearch({
    data: users,
    searchFields: ['firstName', 'lastName', 'email', 'role'],
    minSearchLength: 0
  });

  const {
    currentPage,
    totalPages,
    goToPage,
    getPageData
  } = usePagination({
    totalItems: filteredUsers.length,
    itemsPerPage: 12
  });

  const currentPageUsers = getPageData(filteredUsers);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Mock data - in real app, this would call userService.getUsers()
      const mockUsers = [
        {
          id: '1',
          firstName: 'Ankur',
          lastName: 'Saroj',
          email: 'ankursaroj6396@google.com',
          phone: '+91 6396595947',
          role: 'Admin',
          status: 'active',
          avatar: '',
          createdAt: '2024-01-15T10:00:00Z',
          lastLogin: '2024-02-20T14:30:00Z'
        },
        {
          id: '2',
          firstName: 'Chetan',
          lastName: 'M A',
          email: 'example@google.com',
          phone: '+91 555987-6543',
          role: 'Developer',
          status: 'active',
          avatar: '',
          createdAt: '2024-01-20T11:30:00Z',
          lastLogin: '2024-02-20T16:45:00Z'
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    navigate('/users/new');
  };

  const handleViewUser = (user) => {
    navigate(`/users/${user.id}`);
  };

  const handleEditUser = (user) => {
    navigate(`/users/${user.id}/edit`);
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      try {
        // await userService.deleteUser(user.id);
        setUsers(prev => prev.filter(u => u.id !== user.id));
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} user(s)?`)) {
      try {
        // In real app: await Promise.all(selectedUsers.map(id => userService.deleteUser(id)));
        setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
        setSelectedUsers([]);
        toast.success(`${selectedUsers.length} user(s) deleted successfully`);
      } catch (error) {
        toast.error('Failed to delete users');
      }
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === currentPageUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentPageUsers.map(user => user.id));
    }
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
    return <Loading type="table" count={12} />;
  }

  return (
    <div className="user-list">
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Users</h1>
            <p>Manage user accounts and permissions</p>
          </div>
          <div className="header-actions">
            {selectedUsers.length > 0 && (
              <button 
                className="btn btn-danger"
                onClick={handleBulkDelete}
              >
                <FiTrash2 />
                Delete Selected ({selectedUsers.length})
              </button>
            )}
            <button className="btn btn-primary" onClick={handleCreateUser}>
              <FiPlus />
              Add User
            </button>
          </div>
        </div>
      </div>

      <div className="user-controls">
        <SearchBox
          placeholder="Search users..."
          value={searchTerm}
          onSearch={handleSearchChange}
          showFilters={true}
          filters={[
            {
              key: 'role',
              label: 'Role',
              type: 'select',
              options: [
                { value: 'Admin', label: 'Admin' },
                { value: 'Developer', label: 'Developer' },
                { value: 'Viewer', label: 'Viewer' },
                { value: 'Manager', label: 'Manager' }
              ]
            },
            {
              key: 'status',
              label: 'Status',
              type: 'select',
              options: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ]
            }
          ]}
        />
      </div>

      <div className="users-table">
        <div className="table-header">
          <div className="table-row">
            <div className="table-cell">
              <input
                type="checkbox"
                checked={selectedUsers.length === currentPageUsers.length && currentPageUsers.length > 0}
                onChange={handleSelectAll}
              />
            </div>
            <div className="table-cell">User</div>
            <div className="table-cell">Contact</div>
            <div className="table-cell">Role</div>
            <div className="table-cell">Status</div>
            <div className="table-cell">Last Login</div>
            <div className="table-cell">Actions</div>
          </div>
        </div>

        <div className="table-body">
          {currentPageUsers.map(user => (
            <div key={user.id} className="table-row">
              <div className="table-cell">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleSelectUser(user.id)}
                />
              </div>
              
              <div className="table-cell">
                <div className="user-info">
                  <div className="user-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                    ) : (
                      <div className="avatar-placeholder">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="user-details">
                    <div className="user-name">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="user-id">ID: {user.id}</div>
                  </div>
                </div>
              </div>

              <div className="table-cell">
                <div className="contact-info">
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

              <div className="table-cell">
                <span 
                  className="role-badge"
                  style={{ backgroundColor: getRoleColor(user.role) }}
                >
                  {user.role}
                </span>
              </div>

              <div className="table-cell">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(user.status) }}
                >
                  {user.status}
                </span>
              </div>

              <div className="table-cell">
                <span className="last-login">
                  {user.lastLogin 
                    ? new Date(user.lastLogin).toLocaleDateString()
                    : 'Never'
                  }
                </span>
              </div>

              <div className="table-cell">
                <div className="table-actions">
                  <button
                    className="action-btn"
                    onClick={() => handleViewUser(user)}
                    title="View user"
                  >
                    <FiEye />
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => handleEditUser(user)}
                    title="Edit user"
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="action-btn danger"
                    onClick={() => handleDeleteUser(user)}
                    title="Delete user"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="empty-state">
          <FiPlus className="empty-icon" />
          <h3>No users found</h3>
          <p>
            {searchTerm
              ? 'No users match your search criteria'
              : 'Get started by adding your first user'
            }
          </p>
          {!searchTerm && (
            <button className="btn btn-primary" onClick={handleCreateUser}>
              <FiPlus />
              Add Your First User
            </button>
          )}
        </div>
      )}

      {filteredUsers.length > 12 && (
        <Pagination
          totalItems={filteredUsers.length}
          itemsPerPage={12}
          currentPage={currentPage}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
};

export default UserList;