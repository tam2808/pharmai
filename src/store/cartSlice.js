import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  items: [], // { id, name, image, price, quantity, activeIngredient, requiresPrescription }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const qty = action.payload.quantity || 1;
      const unit = action.payload.selectedUnit || action.payload.unit || 'Hộp';
      const existing = state.items.find((item) => item.id === action.payload.id && (item.selectedUnit || item.unit) === unit);
      if (existing) {
        existing.quantity += qty;
      } else {
        state.items.push({ ...action.payload, selectedUnit: unit, quantity: qty });
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
    },
    incrementQuantity(state, action) {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) item.quantity += 1;
    },
    decrementQuantity(state, action) {
      const item = state.items.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

// Memoized selectors — tránh recompute khi state không đổi
export const selectCartItems = (state) => state.cart.items;

export const selectCartTotalPrice = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0)
);

export const selectCartTotalItems = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.quantity, 0)
);

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;

export const addItem = addToCart;

export default cartSlice.reducer;
