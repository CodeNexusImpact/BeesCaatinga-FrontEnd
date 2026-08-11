import api from './api';
import type { ProducaoRetornoDTO, ProducaoCriadaDTO, ProducaoAtualizadaDTO } from '@/types/producao';

export const listarProducoes = async (produtorId: number | string): Promise<ProducaoRetornoDTO[]> => {
  try {
    const response = await api.get<ProducaoRetornoDTO[]>(`/producoes/${produtorId}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Erro ao listar produções:', error);
    return [];
  }
};

export const getProducoes = listarProducoes;

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
    const response = await api.post<ProducaoRetornoDTO>(`/producoes/${produtorId}`, dto);
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar produção:', error);
    throw error;
  }
};

export const atualizarProducao = async (producaoId: number | string, produtorId: number | string, dto: ProducaoAtualizadaDTO): Promise<ProducaoRetornoDTO> => {
  try {
    const response = await api.put<ProducaoRetornoDTO>(`/producoes/${producaoId}/produtor/${produtorId}`, dto);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar produção ${producaoId}:`, error);
    throw error;
  }
};

export const deletarProducao = async (producaoId: number | string, produtorId: number | string): Promise<void> => {
  try {
    await api.delete(`/producoes/${producaoId}/produtor/${produtorId}`);
  } catch (error) {
    console.error(`Erro ao deletar produção ${producaoId}:`, error);
    throw error;
  }
};

export default {
  listarProducoes,
  getProducoes,
  getProducaoPorId,
  cadastrarProducao,
  atualizarProducao,
  deletarProducao,
};
