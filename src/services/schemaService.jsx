import {buildQueryString } from './api';
import axios from 'axios';

// Axios instance for API requests
const apiRequest = axios.create({
  baseURL: 'http://localhost:8761',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
});

export const schemaService = {

  //get all schema from the db
  getAllSchemas: async (params = {}) => {
    const queryString = buildQueryString(params);
    const url = queryString ? `/schemas?${queryString}` : '/schemas';
    const response = await apiRequest.get(url);
    return response.data;
  },


  // Get schemas for an API
  getSchemas: async (apiId, params = {}) => {
    const queryString = buildQueryString(params);
    const url = queryString 
      ? `/apis/${apiId}/schemas?${queryString}` 
      : `/apis/${apiId}/schemas`;
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Get schema by ID
  getSchema: async (apiId, schemaId) => {
    const response = await apiRequest.get(`/apis/${apiId}/schemas/${schemaId}`);
    return response.data;
  },

  // Create schema
  createSchema: async (apiId, schemaData) => {
    const response = await apiRequest.post(`/apis/${apiId}/schemas`, schemaData);
    return response.data;
  },

  // Update schema
  updateSchema: async (apiId, schemaId, schemaData) => {
    const response = await apiRequest.put(`/apis/${apiId}/schemas/${schemaId}`, schemaData);
    return response.data;
  },

  // Delete schema
  deleteSchema: async (apiId, schemaId) => {
    const response = await apiRequest.delete(`/apis/${apiId}/schemas/${schemaId}`);
    return response.data;
  },

  // Validate schema
  validateSchema: async (apiId, schemaData) => {
    const response = await apiRequest.post(`/apis/${apiId}/schemas/validate`, schemaData);
    return response.data;
  },

  // Generate schema from JSON
  generateSchemaFromJson: async (apiId, jsonData) => {
    const response = await apiRequest.post(`/apis/${apiId}/schemas/generate`, { json: jsonData });
    return response.data;
  },

  // Generate example from schema
  generateExample: async (apiId, schemaId) => {
    const response = await apiRequest.post(`/apis/${apiId}/schemas/${schemaId}/example`);
    return response.data;
  },

  // Clone schema
  cloneSchema: async (apiId, schemaId, newName) => {
    const response = await apiRequest.post(`/apis/${apiId}/schemas/${schemaId}/clone`, { name: newName });
    return response.data;
  },

  // Get schema usage
  getSchemaUsage: async (apiId, schemaId) => {
    const response = await apiRequest.get(`/apis/${apiId}/schemas/${schemaId}/usage`);
    return response.data;
  },

  // Convert schema format
  convertSchema: async (apiId, schemaId, targetFormat) => {
    const response = await apiRequest.post(`/apis/${apiId}/schemas/${schemaId}/convert`, { 
      format: targetFormat 
    });
    return response.data;
  },

  // Get schema dependencies
  getSchemaDependencies: async (apiId, schemaId) => {
    const response = await apiRequest.get(`/apis/${apiId}/schemas/${schemaId}/dependencies`);
    return response.data;
  },

  // Search schemas
  searchSchemas: async (apiId, query) => {
    const response = await apiRequest.get(`/apis/${apiId}/schemas/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Export schema
  exportSchema: async (apiId, schemaId, format = 'json') => {
    const response = await apiRequest.get(`/apis/${apiId}/schemas/${schemaId}/export?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Import schema
  importSchema: async (apiId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiRequest.post(`/apis/${apiId}/schemas/import`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

export default schemaService;