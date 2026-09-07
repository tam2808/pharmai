import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: localStorage.getItem('pharmai-user') ? JSON.parse(localStorage.getItem('pharmai-user')) : null,
  token: localStorage.getItem('pharmai-token') || null,
  isAuthenticated: !!localStorage.getItem('pharmai-token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      // WARNING: Lưu token trong localStorage có rủi ro XSS.
      // Ưu tiên sử dụng httpOnly cookie nếu backend hỗ trợ.
      localStorage.setItem('pharmai-token', action.payload.token);
      localStorage.setItem('pharmai-user', JSON.stringify(action.payload.user));
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('pharmai-token');
      localStorage.removeItem('pharmai-user');
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    updateProfileSuccess(state, action) {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('pharmai-user', JSON.stringify(state.user));
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, setUser, updateProfileSuccess, clearError } =
  authSlice.actions;

export default authSlice.reducer;
