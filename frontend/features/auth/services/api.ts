import axios from 'axios';
import { getToken } from './storage';
import { Platform } from 'react-native';

// determine base URL depending on runtime environment
const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }

  return 'http://localhost:3000';
};

const defaultUrl = getBaseUrl();
console.log('[API] baseURL =', defaultUrl);

export const api = axios.create({
  baseURL: defaultUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const requestUrl = `${config.baseURL ?? ''}${config.url ?? ''}`;
  console.log('[API] request', config.method, requestUrl, config.data ?? '');
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API] response error', error.response?.status, error.response?.data, error.message);
    return Promise.reject(error);
  },
);