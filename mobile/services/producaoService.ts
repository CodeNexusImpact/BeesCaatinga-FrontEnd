import api from './api';
import type { ProducaoRetornoDTO, ProducaoCriadaDTO, ProducaoAtualizadaDTO } from '@/types/producao';

export const getProducoes = async (produtorId: number | string): Promise<ProducaoRetornoDTO[]> => {
  try {
    const response = await api.get<ProducaoRetornoDTO[]>('/producoes', {
      params: { produtorId: Number(produtorId) }
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Erro ao listar produções:', error);
    return [];
  }
};

export const getProducaoPorId = async (producaoId: number | string): Promise<ProducaoRetornoDTO | null> => {
  try {
    const response = await api.get<ProducaoRetornoDTO>(`/producoes/${producaoId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar produção ${producaoId}:`, error);
    throw error;
  }
};

export const cadastrarProducao = async (produtorId: number | string, dto: ProducaoCriadaDTO): Promise<ProducaoRetornoDTO> => {
  try {
    const { id: _, ...payloadLimpo } = dto as any;
    payloadLimpo.produtorId = Number(produtorId);
    
    const response = await api.post<ProducaoRetornoDTO>('/producoes', payloadLimpo);
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar produção:', error);
    throw error;
  }
};

export const atualizarProducao = async (producaoId: number | string, dto: ProducaoAtualizadaDTO): Promise<ProducaoRetornoDTO> => {
  try {
    const { id: _, ...payloadLimpo } = dto as any;
    const response = await api.put<ProducaoRetornoDTO>(`/producoes/${producaoId}`, payloadLimpo);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar produção ${producaoId}:`, error);
    throw error;
  }
};

export const deletarProducao = async (producaoId: number | string): Promise<void> => {
  try {
    await api.delete(`/producoes/${producaoId}`);
  } catch (error) {
    console.error(`Erro ao deletar produção ${producaoId}:`, error);
    throw error;
  }
};