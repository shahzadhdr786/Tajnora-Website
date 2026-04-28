import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tajnora_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tajnora_token');
      localStorage.removeItem('tajnora_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  toggleWishlist: (productId) => api.post(`/auth/wishlist/${productId}`),
};

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getBySlug: (slug) => api.get(`/products/${slug}`),
  getById: (id) => api.get(`/products/id/${id}`),
  getFeatured: (limit) => api.get('/products/featured', { params: { limit } }),
  search: (q) => api.get('/products/search', { params: { q } }),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Orders API
export const ordersAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  getAll: (params) => api.get('/orders', { params }),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
};

// Reviews API
export const reviewsAPI = {
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  create: (productId, data) => api.post(`/reviews/product/${productId}`, data),
  getAll: (params) => api.get('/reviews', { params }),
  approve: (id) => api.put(`/reviews/${id}/approve`),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// Contact API
export const contactAPI = {
  submit: (data) => api.post('/contact', data),
  getAll: (params) => api.get('/contact', { params }),
  markAsRead: (id) => api.put(`/contact/${id}/read`),
  delete: (id) => api.delete(`/contact/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

// Upload API
export const uploadAPI = {
  productImages: (formData) => api.post('/upload/product', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  categoryImage: (formData) => api.post('/upload/category', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  avatar: (formData) => api.post('/upload/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export default api;
