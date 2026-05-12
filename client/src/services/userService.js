import API from './api';

export const getUsers = (params = {}) => API.get('/users', { params });
export const getUserById = (id) => API.get(`/users/${id}`);
export const updateUserRole = (id, data) => API.put(`/users/${id}/role`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const getUserStats = () => API.get('/users/stats');
