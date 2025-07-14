// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8761/api';
export const API_TIMEOUT = 10000;

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS'
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  DEVELOPER: 'Developer',
  VIEWER: 'Viewer'
};

// API Status
export const API_STATUS = {
  ACTIVE: 'active',
  BETA: 'beta',
  DEPRECATED: 'deprecated',
  DRAFT: 'draft'
};

// Product Status
export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  DRAFT: 'draft',
  DISCONTINUED: 'discontinued'
};

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  XML: 'application/xml',
  TEXT: 'text/plain',
  HTML: 'text/html',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_PREFERENCES: 'userPreferences',
  THEME: 'theme',
  CURRENT_ENVIRONMENT: 'currentEnvironment',
  REQUEST_HISTORY: 'requestHistory'
};

// Theme Settings
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 0
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/json'],
  CHUNK_SIZE: 1024 * 1024 // 1MB chunks
};

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[\d\s\-\(\)]+$/,
  URL_REGEX: /^https?:\/\/.+/,
  STRONG_PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  API_KEY_REGEX: /^[a-zA-Z0-9_-]+$/
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. Insufficient permissions.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Internal server error. Please try again later.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Created successfully',
  UPDATED: 'Updated successfully',
  DELETED: 'Deleted successfully',
  SAVED: 'Saved successfully',
  COPIED: 'Copied to clipboard',
  IMPORTED: 'Imported successfully',
  EXPORTED: 'Exported successfully'
};

// Component Schema Types
export const SCHEMA_TYPES = {
  OBJECT: 'object',
  ARRAY: 'array',
  STRING: 'string',
  INTEGER: 'integer',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  NULL: 'null'
};

// OpenAPI Component Types
export const COMPONENT_TYPES = {
  SCHEMAS: 'schemas',
  RESPONSES: 'responses',
  PARAMETERS: 'parameters',
  EXAMPLES: 'examples',
  REQUEST_BODIES: 'requestBodies',
  HEADERS: 'headers',
  SECURITY_SCHEMES: 'securitySchemes'
};

// Request Tester Settings
export const REQUEST_SETTINGS = {
  DEFAULT_TIMEOUT: 30000,
  MAX_HISTORY: 100,
  AUTO_SAVE_INTERVAL: 5000
};

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',
  PURPLE: '#8b5cf6',
  PINK: '#ec4899',
  GRAY: '#6b7280'
};

// Animation Durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
};

export default {
  API_BASE_URL,
  HTTP_METHODS,
  HTTP_STATUS,
  USER_ROLES,
  API_STATUS,
  PRODUCT_STATUS,
  CONTENT_TYPES,
  STORAGE_KEYS,
  THEMES,
  PAGINATION,
  FILE_UPLOAD,
  VALIDATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  SCHEMA_TYPES,
  COMPONENT_TYPES,
  REQUEST_SETTINGS,
  CHART_COLORS,
  ANIMATION
};