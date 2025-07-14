import { get } from 'lodash';
import { buildQueryString } from './api';
import axios from 'axios';
import toast from 'react-hot-toast';

// Axios instance for API requests
const apiRequest = axios.create({
  baseURL: 'http://localhost:8761',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export const endpointService = {

  // Fetch all endpoints
  getAllEndpoints: async (params = {}) => {
    const queryString = buildQueryString(params);
    // toast.loading('Fetching endpoints...');
    const url = queryString ? `/endpoints?${queryString}` : '/apis/endpoints/all';
    const response = await apiRequest.get(url);
    // toast.success('Endpoints fetched successfully');
    return response.data;
  },

  // Get endpoints for an API
  getEndpoints: async (apiId, params = {}) => {
    toast.success(`Fetching endpoints for API ${apiId}`);
    const response = await apiRequest.get(`/apis/${apiId}/endpoints`);
    if (response.status !== 200) {
      toast.error('Failed to fetch endpoints');
      throw new Error('Failed to fetch endpoints');
    }
    toast.success('Endpoints fetched successfully');
    return response.data;
  },

  // Get endpoint by ID
  getEndpoint: async (apiId, endpointId) => {
    const response = await apiRequest.get(`/apis/${apiId}/endpoints/${endpointId}`);
    return response.data;
  },

  // Create endpoint
  createEndpoint: async (apiId, endpointData) => {
    const response = await apiRequest.post(`/apis/${apiId}/endpoints`, endpointData);
    return response.data;
  },

  // Update endpoint
  updateEndpoint: async (apiId, endpointId, endpointData) => {
    const response = await apiRequest.put(`/apis/${apiId}/endpoints/${endpointId}`, endpointData);
    return response.data;
  },

  // Delete endpoint
  deleteEndpoint: async (apiId, endpointId) => {
    const response = await apiRequest.delete(`/apis/${apiId}/endpoints/${endpointId}`);
    return response.data;
  },

  // Test endpoint - note URL corrected to match backend pattern
  testEndpoint: async (endpointId, requestData) => {
    const response = await apiRequest.post(`/endpoints/${endpointId}/test`, requestData);
    return response.data;
  },

  // Generate mock response
  generateMock: async (apiId, endpointId) => {
    const response = await apiRequest.post(`/apis/${apiId}/endpoints/${endpointId}/mock`);
    return response.data;
  },

  // Get endpoint usage analytics
  getEndpointAnalytics: async (apiId, endpointId, timeRange = '7d') => {
    const response = await apiRequest.get(
      `/apis/${apiId}/endpoints/${endpointId}/analytics?range=${timeRange}`
    );
    return response.data;
  },

  // Duplicate endpoint
  duplicateEndpoint: async (apiId, endpointId, newName) => {
    const response = await apiRequest.post(
      `/apis/${apiId}/endpoints/${endpointId}/duplicate`,
      { name: newName }
    );
    return response.data;
  }
};

export default endpointService;