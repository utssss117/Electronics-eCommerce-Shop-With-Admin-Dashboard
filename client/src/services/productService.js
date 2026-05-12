import API from './api';

export const getProducts = (params = {}) => API.get('/products', { params });
export const getProductById = (id) => API.get(`/products/${id}`);
export const getCategories = () => API.get('/products/categories');
export const getBrands = () => API.get('/products/brands');
export const createProduct = (formData) => API.post('/products', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateProduct = (id, formData) => API.put(`/products/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const addReview = (id, data) => API.post(`/products/${id}/reviews`, data);
