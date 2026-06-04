import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Prioriza Variável de Ambiente, senão usa o IP local de desenvolvimento
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.8:8080';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Função utilitária para limpar os dados de sessão (Anti-Zumbi)
const clearStorage = async () => {
    try {
        if (Platform.OS === 'web') {
            localStorage.removeItem('user_token');
            localStorage.removeItem('user_data');
        } else {
            await SecureStore.deleteItemAsync('user_token');
            await SecureStore.deleteItemAsync('user_data');
        }
    } catch (e) {
        console.error('Erro ao limpar storage no interceptor:', e);
    }
};

// INTERCEPTADOR DE RESPOSTA
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401 || status === 404) {
        console.warn(`[Axios Interceptor] Erro ${status} detectado. Expurgando sessão zumbi...`);
        await clearStorage();
      }
    }
    return Promise.reject(error);
  }
);

// O Interceptador de Requisição continua comentado até a implementação do JWT
// ...

export default api;


