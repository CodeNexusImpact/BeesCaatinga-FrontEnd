import api from './api';

export const listarLotesResumido = async (produtorId: number | string) => {
  try {
    const response = await api.get(`/lotes/${produtorId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar lotes resumido:', error);
    throw error;
  }
};

export const listarLotesDetalhado = async (produtorId: number | string) => {
  try {
    const response = await api.get(`/lotes/${produtorId}/detalhado`);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar lotes detalhado:', error);
    throw error;
  }
};

export const cadastrarLote = async (produtorId: number | string, dados: any) => {
  try {
    const response = await api.post(`/lotes/${produtorId}`, dados);
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar lote:', error);
    throw error;
  }
};

export default {
  listarLotesResumido,
  listarLotesDetalhado,
  cadastrarLote,
};
