import axios from 'axios';

// Defina a URL base da sua API aqui.
// Em um ambiente de produção, você pode considerar usar variáveis de ambiente
// para gerenciar diferentes URLs (desenvolvimento, produção, etc.).
const BASE_URL = 'http://localhost:8080'; // Exemplo: ajuste para o endereço real da sua API

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Adicione outros cabeçalhos padrão se necessário (ex: Authorization)
  },
});

export default api;
