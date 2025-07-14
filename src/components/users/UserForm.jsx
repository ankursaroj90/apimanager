import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiUpload, FiX } from 'react-icons/fi';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id && id !== 'new';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Viewer',
    status: 'active',
    password: '',
    confirmPassword: '',
    avatar: null
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (isEditing) {
      fetchUser();
    }
  }, [id, isEditing]);

  const fetchUser = async () => {
    try {
      // const user = await userService.getUser(id);
      // Mock user data
      const user = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        role: 'Admin',
        status: 'active',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'
      };
      
      setFormData({
        ...user,
        password: '',
        confirmPassword: ''
      });
      
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    } catch (error) {
      toast.error('Failed to fetch user');
      navigate('/users');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Avatar file size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      setFormData(prev => ({ ...prev, avatar: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setFormData(prev => ({ ...prev, avatar: null }));
    setAvatarPreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[\+]?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!isEditing) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        role: formData.role,
        status: formData.status
      };

      if (formData.password) {
        userData.password = formData.password;
      }

      if (isEditing) {
        // await userService.updateUser(id, userData);
        toast.success('User updated successfully');
      } else {
        // await userService.createUser(userData);
        toast.success('User created successfully');
      }

      navigate('/users');
    } catch (error) {
      toast.error(isEditing ? 'Failed to update user' : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'Admin', label: 'Admin', description: 'Full system access' },
    { value: 'Manager', label: 'Manager', description: 'Manage teams and projects' },
    { value: 'Developer', label: 'Developer', description: 'Create and modify APIs' },
    { value: 'Viewer', label: 'Viewer', description: 'Read-only access' }
  ];

  return (
    <div className="user-form">
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
              <h1>{isEditing ? 'Edit User' : 'Create User'}</h1>
              <p>{isEditing ? 'Update user information' : 'Add a new user to the system'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="user-form-content">
          <div className="form-section">
            <h3>Profile Information</h3>
            
            <div className="avatar-section">
              <div className="avatar-upload">
                <div className="avatar-preview">
                  {avatarPreview ? (
                    <div className="avatar-image">
                      <img src={avatarPreview} alt="Avatar preview" />
                      <button
                        type="button"
                        className="remove-avatar"
                        onClick={removeAvatar}
                      >
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <div className="avatar-placeholder">
                      <FiUpload />
                      <span>Upload Avatar</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="avatar-input"
                />
                <small>Maximum file size: 5MB. Supported formats: JPG, PNG, GIF</small>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter first name"
                  className={errors.firstName ? 'error' : ''}
                />
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter last name"
                  className={errors.lastName ? 'error' : ''}
                />
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Access & Permissions</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="role">Role *</label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <small>
                  {roles.find(r => r.value === formData.role)?.description}
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>{isEditing ? 'Change Password' : 'Password'}</h3>
            {isEditing && (
              <p className="section-description">
                Leave empty to keep current password
              </p>
            )}
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="password">
                  {isEditing ? 'New Password' : 'Password *'}
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder={isEditing ? 'Enter new password' : 'Enter password'}
                  className={errors.password ? 'error' : ''}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  {isEditing ? 'Confirm New Password' : 'Confirm Password *'}
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm password"
                  className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/users')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <FiSave />
                  {isEditing ? 'Update User' : 'Create User'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;