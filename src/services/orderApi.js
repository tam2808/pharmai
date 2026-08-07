import axiosClient from './axiosClient';

/**
 * Tạo đơn hàng mới.
 * @returns {{ data: { orderId, status, total } }}
 */
export const createOrder = async (orderData) => {
  const response = await axiosClient.post('/orders', orderData);
  return response.data;
};

/**
 * Lấy URL thanh toán VNPay cho đơn hàng.
 * @returns {{ data: { paymentUrl, orderId } }}
 */
export const getVnpayUrl = async (orderId, amount) => {
  const response = await axiosClient.post('/payment/vnpay', { orderId, amount });
  return response.data;
};

/**
 * Lấy trạng thái đơn hàng theo ID (dùng sau VNPay callback).
 * @returns {{ data: { orderId, status, totalPrice, paymentMethod, fullName, createdAt } }}
 */
export const getOrderById = async (orderId) => {
  const response = await axiosClient.get(`/payment/order/${orderId}`);
  return response.data;
};

/**
 * Lấy danh sách tất cả đơn hàng (Admin).
 * @returns {{ data: Order[] }}
 */
export const getOrders = async () => {
  const response = await axiosClient.get('/orders');
  return response.data;
};
