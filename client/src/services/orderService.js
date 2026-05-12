import API from './api';

export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/myorders');
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const getAllOrders = (params = {}) => API.get('/orders', { params });
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}/status`, data);
export const updateOrderToPaid = (id, data) => API.put(`/orders/${id}/pay`, data);
export const getOrderStats = () => API.get('/orders/stats');
