import api from './api';

const BASE_URL = '/lotes';

export interface RastreabilidadeDTO {
  id?: number;
  produtorId: number;
  apiarioId: number;
  dataProducao: string;
  quantidadeProduzida: number;
  tipoFlorada: string;
  tipoAbelha: string;
  vendido: boolean;
  latitude?: number;
  longitude?: number;
}

export const getRastreabilidade = async (produtorId: number | string): Promise<RastreabilidadeDTO[]> => {
  try {
    const response = await api.get<RastreabilidadeDTO[]>(`${BASE_URL}/${produtorId}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Erro ao listar rastreabilidade/lotes:', error);
    return [];
  }
};

export const getRastreabilidadeById = async (id: number | string): Promise<RastreabilidadeDTO | null> => {
  try {
    const response = await api.get<RastreabilidadeDTO>(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar rastreabilidade/lote ${id}:`, error);
    throw error;
  }
};

export const cadastrarRastreabilidade = async (produtorId: number | string, dados: any): Promise<RastreabilidadeDTO> => {
  try {
    const response = await api.post<RastreabilidadeDTO>(`${BASE_URL}/${produtorId}`, dados);
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar rastreabilidade/lote:', error);
    throw error;
  }
};

export const atualizarRastreabilidade = async (id: number | string, produtorId: number | string, dados: any): Promise<RastreabilidadeDTO> => {
  try {
    const response = await api.put<RastreabilidadeDTO>(`${BASE_URL}/${id}/produtor/${produtorId}`, dados);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar rastreabilidade/lote ${id}:`, error);
    throw error;
  }
};

export const deletarRastreabilidade = async (id: number | string, produtorId: number | string): Promise<void> => {
  try {
    await api.delete(`${BASE_URL}/${id}/produtor/${produtorId}`);
  } catch (error) {
    console.error(`Erro ao deletar rastreabilidade/lote ${id}:`, error);
    throw error;
  }
};

export default {
  getRastreabilidade,
  getRastreabilidadeById,
  cadastrarRastreabilidade,
  atualizarRastreabilidade,
  deletarRastreabilidade,
};
