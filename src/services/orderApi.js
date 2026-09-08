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
 * Lấy URL thanh toán VNPay cho đơn hàng (mặc định bankCode = 'VNPAYQR' để hiện thẳng mã QR).
 * @returns {{ data: { paymentUrl, orderId } }}
 */
export const getVnpayUrl = async (orderId, amount, bankCode = 'VNPAYQR') => {
  const response = await axiosClient.post('/payment/vnpay', { orderId, amount, bankCode });
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

/**
 * Lấy danh sách đơn hàng cá nhân của tài khoản đăng nhập.
 * @returns {{ data: Order[] }}
 */
export const getMyOrders = async (email = '', phone = '') => {
  const params = new URLSearchParams();
  if (email) params.append('email', email);
  if (phone) params.append('phone', phone);
  const response = await axiosClient.get(`/orders/my-orders?${params.toString()}`);
  return response.data;
};

/**
 * Tra cứu tiến trình đơn hàng theo mã đơn hàng.
 * @returns {{ data: Order }}
 */
export const trackOrder = async (orderId) => {
  const response = await axiosClient.get(`/orders/track/${orderId}`);
  return response.data;
};

/**
 * Cập nhật trạng thái đơn hàng (Ví dụ: đã chuyển khoản -> chờ Admin xác nhận)
 */
export const updateOrderStatus = async (orderId, status) => {
  const response = await axiosClient.put(`/orders/${orderId}/status`, { status });
  return response.data;
};

/**
 * Hủy & xóa đơn hàng khỏi hệ thống
 */
export const deleteOrder = async (orderId) => {
  const response = await axiosClient.delete(`/orders/${orderId}`);
  return response.data;
};

