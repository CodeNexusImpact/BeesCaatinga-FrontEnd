import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'user_token';
const USER_KEY = 'user_data';

// URL da API definida em tempo de build via EXPO_PUBLIC_API_URL (ver .env.example).
const resolveBaseUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) return envUrl.replace(/\/+$/, '');
  if (__DEV__) return 'http://localhost:8080';
  console.warn('[api] EXPO_PUBLIC_API_URL não definida; usando a mesma origem.');
  return '';
};

export const BASE_URL = resolveBaseUrl();

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') return localStorage.getItem(TOKEN_KEY);
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
};

const clearStorage = async () => {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    }
  } catch (e) {
    console.error('Erro ao limpar storage no interceptor:', e);
  }
};

// Anexa o token de sessão (Bearer) em todas as requisições, se existir.
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Sessão inválida/expirada: limpa somente em 401 (404 é recurso inexistente, não sessão).
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await clearStorage();
    }
    return Promise.reject(error);
  }
);

export default api;
