import axiosClient from './axiosClient';

/**
 * Lấy danh sách thuốc (có filter/search)
 */
export const getDrugs = async (params = {}) => {
  const response = await axiosClient.get('/drugs', { params });
  return response.data;
};

/** Alias — dùng cho related drugs */
export const getAllDrugs = getDrugs;


/**
 * Lấy chi tiết 1 thuốc theo ID
 */
export const getDrugById = async (id) => {
  const response = await axiosClient.get(`/drugs/${id}`);
  return response.data?.data || response.data;
};

/**
 * Gợi ý tìm kiếm (autocomplete)
 */
export const getSearchSuggestions = async (query) => {
  if (!query) return { data: [] };
  const response = await axiosClient.get('/drugs/suggestions', { params: { q: query } });
  return response.data;
};

/**
 * Lấy danh mục thuốc
 */
export const getCategories = async () => {
  const response = await axiosClient.get('/drugs/categories');
  return response.data;
};

/**
 * Lấy thuốc nổi bật (cho trang chủ)
 */
export const getDrug = getDrugById;

export const searchDrugs = async (query) => {
  const res = await getDrugs({ q: query });
  return res?.data || res || [];
};

