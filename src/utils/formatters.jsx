// Number formatters
export const formatNumber = (number, options = {}) => {
  const { locale = 'en-US', minimumFractionDigits = 0, maximumFractionDigits = 2 } = options;
  
  if (number === null || number === undefined || isNaN(number)) {
    return '0';
  }
  
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits
  }).format(number);
};

export const formatCurrency = (amount, options = {}) => {
  const { locale = 'en-US', currency = 'USD', showCents = true } = options;
  
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '$0.00';
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0
  }).format(amount);
};

export const formatPercentage = (value, options = {}) => {
  const { locale = 'en-US', minimumFractionDigits = 0, maximumFractionDigits = 1 } = options;
  
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits
  }).format(value / 100);
};

// Date formatters
export const formatDate = (date, options = {}) => {
  const { locale = 'en-US', dateStyle = 'medium' } = options;
  
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  return new Intl.DateTimeFormat(locale, { dateStyle }).format(dateObj);
};

export const formatDateTime = (date, options = {}) => {
  const { locale = 'en-US', dateStyle = 'medium', timeStyle = 'short' } = options;
  
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  return new Intl.DateTimeFormat(locale, { dateStyle, timeStyle }).format(dateObj);
};

export const formatTime = (date, options = {}) => {
  const { locale = 'en-US', timeStyle = 'short' } = options;
  
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  return new Intl.DateTimeFormat(locale, { timeStyle }).format(dateObj);
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  
  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;
  
  if (diffMs < minute) {
    return 'just now';
  } else if (diffMs < hour) {
    const minutes = Math.floor(diffMs / minute);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (diffMs < day) {
    const hours = Math.floor(diffMs / hour);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (diffMs < week) {
    const days = Math.floor(diffMs / day);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  } else if (diffMs < month) {
    const weeks = Math.floor(diffMs / week);
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  } else if (diffMs < year) {
    const months = Math.floor(diffMs / month);
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffMs / year);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  }
};

export const formatDuration = (milliseconds) => {
  if (!milliseconds || milliseconds < 0) return '0ms';
  
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else if (seconds > 0) {
    return `${seconds}s`;
  } else {
    return `${milliseconds}ms`;
  }
};

// String formatters
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const formatPhoneNumber = (phoneNumber, format = 'US') => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  if (format === 'US') {
    // US format: (123) 456-7890
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned[0] === '1') {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
  }
  
  return phoneNumber; // Return original if can't format
};

export const formatCreditCard = (cardNumber) => {
  if (!cardNumber) return '';
  
  // Remove all non-digit characters
  const cleaned = cardNumber.replace(/\D/g, '');
  
  // Add spaces every 4 digits
  return cleaned.replace(/(.{4})/g, '$1 ').trim();
};

export const formatSSN = (ssn) => {
  if (!ssn) return '';
  
  // Remove all non-digit characters
  const cleaned = ssn.replace(/\D/g, '');
  
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`;
  }
  
  return ssn; // Return original if can't format
};

// URL formatters
export const formatUrl = (url) => {
  if (!url) return '';
  
  // Add protocol if missing
  if (!url.match(/^https?:\/\//)) {
    url = 'https://' + url;
  }
  
  return url;
};

export const formatSlug = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Code formatters
export const formatJSON = (obj, indent = 2) => {
  try {
    return JSON.stringify(obj, null, indent);
  } catch (error) {
    return String(obj);
  }
};

export const formatXML = (xmlString) => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    const serializer = new XMLSerializer();
    return serializer.serializeToString(xmlDoc);
  } catch (error) {
    return xmlString;
  }
};

// API response formatters
export const formatHttpStatus = (status) => {
  const statusTexts = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    422: 'Unprocessable Entity',
    500: 'Internal Server Error'
  };
  
  return statusTexts[status] || 'Unknown';
};

export const formatResponseTime = (milliseconds) => {
  if (milliseconds < 1000) {
    return `${Math.round(milliseconds)}ms`;
  } else if (milliseconds < 60000) {
    return `${(milliseconds / 1000).toFixed(1)}s`;
  } else {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return `${minutes}m ${seconds}s`;
  }
};

// List formatters
export const formatList = (items, options = {}) => {
  const { locale = 'en-US', style = 'long', type = 'conjunction' } = options;
  
  if (!Array.isArray(items) || items.length === 0) {
    return '';
  }
  
  if (items.length === 1) {
    return String(items[0]);
  }
  
  try {
    return new Intl.ListFormat(locale, { style, type }).format(items.map(String));
  } catch (error) {
    // Fallback for browsers that don't support Intl.ListFormat
    if (items.length === 2) {
      return `${items[0]} and ${items[1]}`;
    }
    return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
  }
};

// Validation helpers
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone);
};

// Utility functions
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + suffix;
};

export const capitalizeFirst = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const capitalizeWords = (text) => {
  if (!text) return '';
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

export const camelToTitle = (camelCase) => {
  if (!camelCase) return '';
  return camelCase
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

// Export all formatters
export default {
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  formatDuration,
  formatBytes,
  formatPhoneNumber,
  formatCreditCard,
  formatSSN,
  formatUrl,
  formatSlug,
  formatJSON,
  formatXML,
  formatHttpStatus,
  formatResponseTime,
  formatList,
  isValidEmail,
  isValidUrl,
  isValidPhoneNumber,
  truncateText,
  capitalizeFirst,
  capitalizeWords,
  camelToTitle
};