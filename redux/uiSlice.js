import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    modal: null, // e.g., { type: 'CREATE_BLOG', props: {...} }
    toast: null, // e.g., { type: 'success', message: 'Saved!' }
    loading: false,
    error: null,
  },
  reducers: {
    openModal(state, action) {
      state.modal = action.payload;
    },
    closeModal(state) {
      state.modal = null;
    },
    showToast(state, action) {
      state.toast = action.payload;
    },
    hideToast(state) {
      state.toast = null;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export default uiSlice.reducer;
export const {
  openModal,
  closeModal,
  showToast,
  hideToast,
  setLoading,
  setError,
  clearError,
} = uiSlice.actions;
