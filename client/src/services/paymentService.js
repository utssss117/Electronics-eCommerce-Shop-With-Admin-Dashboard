import API from './api';

export const createPaymentIntent = (amount) => API.post('/payment/create-payment-intent', { amount });
