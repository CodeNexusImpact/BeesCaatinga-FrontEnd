import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080'; 
// Dica: Use 'http://10.0.2.2:8080' para emulador Android
// Dica: Use seu IP local (ex: 192.168.1.x) para celular físico (ex: http://192.168.1.5:8080)

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// // CONFIGURAÇÃO DO INTERCEPTADOR DE REQUISIÇÃO
// api.interceptors.request.use(
//   async (config) => {
//     // 1. Lista de rotas que NÃO precisam de token
//     const rotasPublicas = ['/login', '/produtores', '/usuarios/registrar'];

//     // 2. Verifica se a requisição atual coincide com alguma rota pública
//     // Se a URL contiver ou terminar com uma das rotas públicas, envia direto sem token
//     const ehRotaPublica = rotasPublicas.some(rota => config.url?.endsWith(rota));

//     if (!ehRotaPublica) {
//       // 3. Busca o token salvo de forma segura no dispositivo
//       const token = await SecureStore.getItemAsync('user_token');

//       // 4. Se o token existir, injeta ele no cabeçalho Authorization
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }

//     return config;
//   },
//   (error) => {
//     // Trata erros antes da requisição ser enviada (raro de acontecer)
//     return Promise.reject(error);
//   }
// );

export default api;
