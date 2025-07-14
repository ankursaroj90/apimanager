import {buildQueryString } from './api';
import axios from 'axios';

// Axios instance for API requests
const apiRequest = axios.create({
  baseURL: 'http://localhost:8761/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
});

export const apiService = {
  // Get all APIs
  getApis: async (params = {}) => {
    const queryString = buildQueryString(params);
    const url = queryString ? `/all` : '/all';
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Get API by ID
  getApi: async (id) => {
    const response = await apiRequest.get(`/find/${id}`);
    return response.data;
  },

  // Create new API
  createApi: async (apiData) => {
    const response = await apiRequest.post('/create', apiData);
    console.log('API created:', response.data);
    return response.data;
  },

  // Update API
  updateApi: async (id, apiData) => {
    const response = await apiRequest.put(`/update/${id}`, apiData);
    return response.data;
  },

  // Delete API
  deleteApi: async (id) => {
    const response = await apiRequest.delete(`/delete/${id}`);
    return response.data;
  },

  // Clone API
  cloneApi: async (id, newName) => {
    const response = await apiRequest.post(`/apis/${id}/clone`, { name: newName });
    return response.data;
  },

  // Get API versions
  getApiVersions: async (id) => {
    const response = await apiRequest.get(`/apis/${id}/versions`);
    return response.data;
  },

  // Create API version
  createApiVersion: async (id, versionData) => {
    const response = await apiRequest.post(`/apis/${id}/versions`, versionData);
    return response.data;
  },

  //delete API version
  deleteApiVersion: async (id, versionId) => {
    const response = await apiRequest.delete(`/apis/${id}/versions/${versionId}`);
    return response.data;
  },

  // Update API version
  updateApiVersion: async (id, versionId, versionData) => {
    const response = await apiRequest.put(`/apis/${id}/versions/${versionId}`, versionData);
    return response.data;
  },

  // Export API
  exportApi: async (id, format = 'json') => {
    const response = await apiRequest.get(`/apis/${id}/export?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Import API
  importApi: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiRequest.post('/apis/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Validate API specification
  validateApi: async (spec) => {
    const response = await apiRequest.post('/apis/validate', { spec });
    return response.data;
  },

  // Generate API documentation
  generateDocs: async (id, format = 'html') => {
    const response = await apiRequest.get(`/apis/${id}/docs?format=${format}`, {
      responseType: format === 'html' ? 'text' : 'blob'
    });
    return response.data;
  }
};

export default apiService;