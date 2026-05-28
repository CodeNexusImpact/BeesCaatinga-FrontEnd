import api from './api';

const BASE_URL = '/rastreamentos';

export interface Rastreamento {
  id?: number;
  dataProducao: string;
  quantidadeProduzida: number;
  apiarioId: number;
  tipoFlorada: string;
  tipoAbelha: string;
  lacrado: boolean;
  vendido: boolean;
  produtorId: number;
  nomeApiario?: string; // Para exibição
}

export const getRastreamentos = async (produtorId: number | string): Promise<Rastreamento[]> => {
  try {
    const response = await api.get<Rastreamento[]>(BASE_URL, {
      params: { produtorId: Number(produtorId) }
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Erro ao listar rastreamentos:', error);
    return [];
  }
};

export const getRastreamentoById = async (id: number | string): Promise<Rastreamento | null> => {
  try {
    const response = await api.get<Rastreamento>(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar rastreamento ${id}:`, error);
    throw error;
  }
};

export const cadastrarRastreamento = async (produtorId: number | string, dados: any): Promise<Rastreamento> => {
  try {
    const { id, ...payload } = dados;
    payload.produtorId = Number(produtorId);
    
    const response = await api.post<Rastreamento>(BASE_URL, payload);
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar rastreamento:', error);
    throw error;
  }
};

export const atualizarRastreamento = async (id: number | string, dados: any): Promise<Rastreamento> => {
  try {
    const { id: _, ...payload } = dados;
    const response = await api.put<Rastreamento>(`${BASE_URL}/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar rastreamento ${id}:`, error);
    throw error;
  }
};

export const deletarRastreamento = async (id: number | string): Promise<void> => {
  try {
    await api.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar rastreamento ${id}:`, error);
    throw error;
  }
};

export default {
  getRastreamentos,
  getRastreamentoById,
  cadastrarRastreamento,
  atualizarRastreamento,
  deletarRastreamento,
};
