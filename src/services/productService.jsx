import { apiRequest, buildQueryString } from './api';

export const productService = {
  // Get all products
  getProducts: async (params = {}) => {
    const queryString = buildQueryString(params);
    const url = queryString ? `/products?${queryString}` : '/products';
    const response = await apiRequest.get(url);
    return response.data;
  },

  // Get product by ID
  getProduct: async (id) => {
    const response = await apiRequest.get(`/products/${id}`);
    return response.data;
  },

  // Create product
  createProduct: async (productData) => {
    const response = await apiRequest.post('/products', productData);
    return response.data;
  },

  // Update product
  updateProduct: async (id, productData) => {
    const response = await apiRequest.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await apiRequest.delete(`/products/${id}`);
    return response.data;
  },

  // Search products
  searchProducts: async (query) => {
    const response = await apiRequest.get(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (categoryId) => {
    const response = await apiRequest.get(`/products/category/${categoryId}`);
    return response.data;
  },

  // Update product stock
  updateStock: async (id, quantity) => {
    const response = await apiRequest.patch(`/products/${id}/stock`, { quantity });
    return response.data;
  }
};

export default productService;