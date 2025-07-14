import { apiRequest, buildQueryString } from './api';

export const categoryService = {
  // Get all categories
  getCategories: async (params = {}) => {
    const queryString = buildQueryString(params);
    const url = queryString ? `/categories?${queryString}` : '/categories';
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Get category by ID
  getCategory: async (id) => {
    const response = await apiRequest.get(`/categories/${id}`);
    return response.data;
  },

  // Create category
  createCategory: async (categoryData) => {
    const response = await apiRequest.post('/categories', categoryData);
    return response.data;
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    const response = await apiRequest.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Delete category
  deleteCategory: async (id) => {
    const response = await apiRequest.delete(`/categories/${id}`);
    return response.data;
  },

  // Get category tree
  getCategoryTree: async () => {
    const response = await apiRequest.get('/categories/tree');
    return response.data;
  }
};

export default categoryService;