import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Experience APIs
export const getExperiences = async () => {
  const response = await api.get('/experiences/');
  return response.data;
};

export const searchExperiences = async (query: string) => {
  const response = await api.get(`/experiences/search?q=${encodeURIComponent(query)}`);
  return response.data;
};

export const getExperienceById = async (id: string) => {
  const response = await api.get(`/experiences/${id}`);
  return response.data;
};

// Booking APIs
export const createBooking = async (bookingData: any) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const getBookingByReference = async (reference: string) => {
  const response = await api.get(`/bookings/${reference}`);
  return response.data;
};

// Promo Code APIs
export const validatePromoCode = async (code: string, orderValue: number) => {
  const response = await api.post('/promo/validate', { code, orderValue });
  return response.data;
};

export default api;
