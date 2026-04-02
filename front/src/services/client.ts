import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
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