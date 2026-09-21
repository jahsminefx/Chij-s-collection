import axios from 'axios';

const api = axios.create({
  baseURL: '', // Uses Vite proxy in development (/api)
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle common errors gracefully
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected network error occurred.';
    const customError = new Error(message);
    customError.statusCode = error.response?.status;
    customError.data = error.response?.data;
    return Promise.reject(customError);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  logout: () => api.post('/api/auth/logout'),
  getMe: () => api.get('/api/auth/me'),
};

// Storefront & Admin Products API
export const productAPI = {
  getPublicProducts: (params) => api.get('/api/products', { params }),
  getPublicProductBySlug: (slug) => api.get(`/api/products/${slug}`),
  getAdminProducts: (params) => api.get('/api/products/admin/all', { params }),
  getAdminProductById: (id) => api.get(`/api/products/admin/${id}`),
  createProduct: (data) => api.post('/api/products', data),
  updateProduct: (id, data) => api.put(`/api/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/api/products/${id}`),
  toggleStock: (id, stockStatus) => api.patch(`/api/products/${id}/stock`, { stockStatus }),
  togglePublish: (id, isPublished) => api.patch(`/api/products/${id}/publish`, { isPublished }),
};

// Storefront & Admin Categories API
export const categoryAPI = {
  getPublicCategories: () => api.get('/api/categories'),
  getPublicCategoryBySlug: (slug) => api.get(`/api/categories/${slug}`),
  getAdminCategories: () => api.get('/api/categories/admin/all'),
  createCategory: (data) => api.post('/api/categories', data),
  updateCategory: (id, data) => api.put(`/api/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/api/categories/${id}`),
};

// Storefront & Admin Store Settings API
export const storeAPI = {
  getPublicSettings: () => api.get('/api/store'),
  getAdminSettings: () => api.get('/api/store/admin'),
  updateSettings: (data) => api.put('/api/store', data),
};

// Image Upload API (multipart/form-data)
export const uploadAPI = {
  uploadImages: (formData) => api.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export default api;
