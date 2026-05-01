import { configureStore, createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('ck_user')) || null,
    token: localStorage.getItem('ck_token') || null,
    loading: false,
    error: null,
  },
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('ck_token', action.payload.token);
      localStorage.setItem('ck_user', JSON.stringify(action.payload.user));
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('ck_token');
      localStorage.removeItem('ck_user');
    },
    setLoading(state, action) { state.loading = action.payload; },
    setError(state, action) { state.error = action.payload; },
  },
});

export const { setCredentials, logout, setLoading, setError } = authSlice.actions;

export const store = configureStore({
  reducer: { auth: authSlice.reducer },
});
