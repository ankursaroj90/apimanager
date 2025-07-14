import { VALIDATION } from './constants';

// Email validation
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!VALIDATION.EMAIL_REGEX.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

// Password validation
export const validatePassword = (password, options = {}) => {
  const { minLength = 8, requireStrong = false } = options;
  
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < minLength) {
    return { isValid: false, error: `Password must be at least ${minLength} characters` };
  }
  
  if (requireStrong && !VALIDATION.STRONG_PASSWORD_REGEX.test(password)) {
    return { 
      isValid: false, 
      error: 'Password must contain uppercase, lowercase, number, and special character' 
    };
  }
  
  return { isValid: true };
};

// Phone number validation
export const validatePhone = (phone) => {
  if (!phone) {
    return { isValid: true }; // Phone is optional
  }
  
  if (!VALIDATION.PHONE_REGEX.test(phone)) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }
  
  return { isValid: true };
};

// URL validation
export const validateUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL is required' };
  }
  
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' };
  }
};

// Required field validation
export const validateRequired = (value, fieldName = 'Field') => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (typeof value === 'string' && !value.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  return { isValid: true };
};

// String length validation
export const validateLength = (value, options = {}) => {
  const { min = 0, max = Infinity, fieldName = 'Field' } = options;
  
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: `${fieldName} must be a string` };
  }
  
  if (value.length < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min} characters` };
  }
  
  if (value.length > max) {
    return { isValid: false, error: `${fieldName} must be no more than ${max} characters` };
  }
  
  return { isValid: true };
};

// Number validation
export const validateNumber = (value, options = {}) => {
  const { min = -Infinity, max = Infinity, integer = false, fieldName = 'Field' } = options;
  
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  const num = Number(value);
  
  if (isNaN(num)) {
    return { isValid: false, error: `${fieldName} must be a number` };
  }
  
  if (integer && !Number.isInteger(num)) {
    return { isValid: false, error: `${fieldName} must be an integer` };
  }
  
  if (num < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min}` };
  }
  
  if (num > max) {
    return { isValid: false, error: `${fieldName} must be no more than ${max}` };
  }
  
  return { isValid: true };
};

// JSON validation
export const validateJson = (value, fieldName = 'JSON') => {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  try {
    JSON.parse(value);
    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: `Invalid ${fieldName} format` };
  }
};

// Array validation
export const validateArray = (value, options = {}) => {
  const { minLength = 0, maxLength = Infinity, fieldName = 'Array' } = options;
  
  if (!Array.isArray(value)) {
    return { isValid: false, error: `${fieldName} must be an array` };
  }
  
  if (value.length < minLength) {
    return { isValid: false, error: `${fieldName} must have at least ${minLength} items` };
  }
  
  if (value.length > maxLength) {
    return { isValid: false, error: `${fieldName} must have no more than ${maxLength} items` };
  }
  
  return { isValid: true };
};

// File validation
export const validateFile = (file, options = {}) => {
  const { 
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = [],
    fieldName = 'File'
  } = options;
  
  if (!file) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: `${fieldName} size must be less than ${formatFileSize(maxSize)}` 
    };
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: `${fieldName} type must be one of: ${allowedTypes.join(', ')}` 
    };
  }
  
  return { isValid: true };
};

// Form validation helper
export const validateForm = (data, rules) => {
  const errors = {};
  let isValid = true;
  
  Object.entries(rules).forEach(([field, fieldRules]) => {
    const value = data[field];
    
    for (const rule of fieldRules) {
      const result = rule(value);
      if (!result.isValid) {
        errors[field] = result.error;
        isValid = false;
        break; // Stop at first error for this field
      }
    }
  });
  
  return { isValid, errors };
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Export all validators
export default {
  validateEmail,
  validatePassword,
  validatePhone,
  validateUrl,
  validateRequired,
  validateLength,
  validateNumber,
  validateJson,
  validateArray,
  validateFile,
  validateForm
};