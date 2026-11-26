import api from './api';
import { listarLotesDetalhado } from './loteService';

const BASE_URL = '/lotes';

export interface RastreabilidadeDTO {
  id?: number;
  produtorId?: number;
  apiarioId: number;
  dataProducao: string;
  quantidadeProduzida: number;
  tipoFlorada: string;
  tipoAbelha: string;
  vendido?: boolean;
  nomeApiario?: string;
  latitude?: number;
  longitude?: number;
  colmeiaId?: number | null;
  identificadorColmeia?: string | null;
  pendente?: boolean;
}

// Lista detalhada com cache offline e lotes pendentes de envio.
export const getRastreabilidade = async (produtorId: number | string): Promise<RastreabilidadeDTO[]> => listarLotesDetalhado(produtorId);

// O backend não expõe GET /lotes/{id}: busca na listagem detalhada do produtor.
export const getRastreabilidadeById = async (
  produtorId: number | string,
  id: number | string,
): Promise<RastreabilidadeDTO | null> => {
  try {
    const lista = await getRastreabilidade(produtorId);
    return lista.find((l) => String(l.id) === String(id)) ?? null;
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
