import axios from 'axios';
import { getToken } from './storage';
import { Platform } from 'react-native';

// determine base URL depending on runtime environment
const defaultUrl = process.env.EXPO_PUBLIC_API_URL;


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

  return config;
});