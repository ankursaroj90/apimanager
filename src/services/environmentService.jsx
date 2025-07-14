import {buildQueryString } from './api';
import axios from 'axios';

// Axios instance for API requests
const apiRequest = axios.create({
  baseURL: 'http://localhost:8761',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
});

export const environmentService = {
  // Get all environments
  getEnvironments: async (params = {}) => {
    const queryString = buildQueryString(params);
    const url = queryString ? `/environments?${queryString}` : '/environments';
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Get environment by ID
  getEnvironment: async (id) => {
    const response = await apiRequest.get(`/environments/${id}`);
    return response.data;
  },

  // Create environment
  createEnvironment: async (environmentData) => {
    const response = await apiRequest.post('/environments', environmentData);
    return response.data;
  },

  // Update environment
  updateEnvironment: async (id, environmentData) => {
    const response = await apiRequest.put(`/environments/${id}`, environmentData);
    return response.data;
  },

  // Delete environment
  deleteEnvironment: async (id) => {
    const response = await apiRequest.delete(`/environments/${id}`);
    return response.data;
  },

  // Clone environment
  cloneEnvironment: async (id, newName) => {
    const response = await apiRequest.post(`/environments/${id}/clone`, { name: newName });
    return response.data;
  },

  // Set active environment
  setActiveEnvironment: async (id) => {
    const response = await apiRequest.post(`/environments/${id}/activate`);
    return response.data;
  },

  // Test environment connectivity
  testEnvironment: async (id) => {
    const response = await apiRequest.post(`/environments/${id}/test`);
    return response.data;
  },

  // Get environment variables
  getEnvironmentVariables: async (id) => {
    const response = await apiRequest.get(`/environments/${id}/variables`);
    return response.data;
  },

  // Update environment variables
  updateEnvironmentVariables: async (id, variables) => {
    const response = await apiRequest.put(`/environments/${id}/variables`, { variables });
    return response.data;
  },

  // Export environment
  exportEnvironment: async (id) => {
    const response = await apiRequest.get(`/environments/${id}/export`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Import environment
  importEnvironment: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiRequest.post('/environments/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

export default environmentService;