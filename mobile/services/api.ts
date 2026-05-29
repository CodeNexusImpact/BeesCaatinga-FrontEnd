import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

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
    // Se a resposta for sucesso, apenas retorna
    return response;
  },
  async (error) => {
    // Se houver erro e a resposta estiver disponível
    if (error.response) {
      const status = error.response.status;
      // Se for Não Autorizado (401) ou Não Encontrado (404 - usuário deletado/inexistente)
      if (status === 401 || status === 404) {
        console.warn(`[Axios Interceptor] Erro ${status} detectado. Expurgando sessão zumbi...`);
        await clearStorage();
      }
    }
    return Promise.reject(error);
  }
);

// // CONFIGURAÇÃO DO INTERCEPTADOR DE REQUISIÇÃO (Comentado até implementação do JWT)
// api.interceptors.request.use(
//   async (config) => {
//     const rotasPublicas = ['/login', '/produtores', '/usuarios/registrar'];
//     const ehRotaPublica = rotasPublicas.some(rota => config.url?.endsWith(rota));
//     if (!ehRotaPublica) {
//       const token = await SecureStore.getItemAsync('user_token');
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default api;
