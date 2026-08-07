import axiosClient from './axiosClient';

/**
 * Đăng nhập
 */
export const login = async (credentials) => {
  const response = await axiosClient.post('/auth/login', credentials);
  return response.data;
};

/**
 * Đăng ký
 */
export const register = async (userData) => {
  const response = await axiosClient.post('/auth/register', userData);
  return response.data;
};

/**
 * Xác thực mã OTP
 */
export const verifyOtp = async (verificationData) => {
  const response = await axiosClient.post('/auth/verify-otp', verificationData);
  return response.data;
};

/**
 * Lấy thông tin user hiện tại
 */
export const getCurrentUser = async () => {
  // Trả về null vì Backend demo không lưu session dạng DB cho trạng thái đăng nhập
  return { data: null };
};

/**
 * Đăng xuất
 */
export const logoutApi = async () => {
  return { data: { message: 'Đăng xuất thành công' } };
};
