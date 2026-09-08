import axiosClient from './axiosClient';

// ============================================================
// Drug Admin APIs
// ============================================================

export const getAllDrugsAdmin = async (params = {}) => {
  const response = await axiosClient.get('/drugs', { params });
  return response.data;
};

export const createDrug = async (drugData) => {
  const response = await axiosClient.post('/drugs', drugData);
  return response.data;
};

export const updateDrug = async (id, drugData) => {
  const response = await axiosClient.put(`/drugs/${id}`, drugData);
  return response.data;
};

export const deleteDrug = async (id) => {
  const response = await axiosClient.delete(`/drugs/${id}`);
  return response.data;
};

// ============================================================
// Order Admin APIs
// ============================================================

export const getAllOrders = async () => {
  const response = await axiosClient.get('/orders');
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await axiosClient.put(`/orders/${id}/status`, { status });
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await axiosClient.delete(`/orders/${id}`);
  return response.data;
};

export const getRevenueReport = async () => {
  const response = await axiosClient.get('/orders/revenue');
  return response.data;
};

// ============================================================
// Customer & Account Admin APIs
// ============================================================

export const getAllCustomers = async (params = {}) => {
  const response = await axiosClient.get('/admin/users', { params });
  return response.data;
};

export const createCustomer = async (userData) => {
  const response = await axiosClient.post('/admin/users', userData);
  return response.data;
};

export const updateCustomer = async (id, userData) => {
  const response = await axiosClient.put(`/admin/users/${id}`, userData);
  return response.data;
};

export const toggleCustomerStatus = async (id) => {
  const response = await axiosClient.put(`/admin/users/${id}/toggle-status`);
  return response.data;
};

export const resetCustomerPassword = async (id, newPassword) => {
  const response = await axiosClient.put(`/admin/users/${id}/reset-password`, { newPassword });
  return response.data;
};

export const deleteCustomer = async (id) => {
  const response = await axiosClient.delete(`/admin/users/${id}`);
  return response.data;
};
