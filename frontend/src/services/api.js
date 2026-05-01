import axios from 'axios';

// ✅ IMPORTANT: point to backend (8080)
const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// ✅ Attach token if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('ck_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ================= AUTH =================
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');

// ================= CHEFS =================
export const getChefs = (params) => API.get('/chefs', { params });
export const getChef = (id) => API.get(`/chefs/${id}`);
export const addReview = (id, data) => API.post(`/chefs/${id}/review`, data);

// ================= BOOKINGS =================
export const createBooking = (data) => API.post('/bookings', data);
export const getMyBookings = () => API.get('/bookings/my');
export const cancelBooking = (id) => API.patch(`/bookings/${id}/cancel`);

// ================= PAYMENTS =================
export const createBookingOrder = (data) =>
  API.post('/payments/booking-order', data);

export const createSubscriptionOrder = (data) =>
  API.post('/payments/subscription-order', data);

export const verifyPayment = (data) =>
  API.post('/payments/verify', data);

// ================= SUBSCRIPTIONS =================
export const getMySubscriptions = () =>
  API.get('/subscriptions/my');