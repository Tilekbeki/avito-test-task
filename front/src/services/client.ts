import axios from 'axios';
import { config } from '../shared/config';

export const apiClient = axios.create({
  baseURL: config.apiUrl,
  timeout: 10000,
});


apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Unknown error';

    return Promise.reject(new Error(message));
  }
);