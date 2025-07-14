import { apiRequest, buildQueryString } from './api';

export const userService = {
  // Get all users
  getUsers: async (params = {}) => {
    const queryString = buildQueryString(params);
    const url = queryString ? `/users?${queryString}` : '/users';
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Get user by ID
  getUser: async (id) => {
    const response = await apiRequest.get(`/users/${id}`);
    return response.data;
  },

  // Create user
  createUser: async (userData) => {
    const response = await apiRequest.post('/users', userData);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await apiRequest.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await apiRequest.delete(`/users/${id}`);
    return response.data;
  },

  // Search users
  searchUsers: async (query) => {
    const response = await apiRequest.get(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }
};

export default userService;