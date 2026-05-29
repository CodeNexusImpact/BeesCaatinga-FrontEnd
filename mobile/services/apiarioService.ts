import api from './api';
import { ApiarioCriadoDTO, ApiarioRetornoDTO, ApiarioAtualizadoDTO } from '@/types/apiario';

export const listarApiariosPorProdutor = async (produtorId: number | string): Promise<ApiarioRetornoDTO[]> => {
  try {
    const response = await api.get<ApiarioRetornoDTO[]>(`/apiarios/${produtorId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar apiários:', error);
    throw error;
  }
};

export const cadastrarApiario = async (produtorId: number, apiario: ApiarioCriadoDTO): Promise<ApiarioRetornoDTO> => {
  try {
    const response = await api.post<ApiarioRetornoDTO>(`/apiarios/${produtorId}`, apiario);
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar apiário:', error);
    throw error;
  }
};

export const atualizarApiario = async (apiarioId: number, produtorId: number, apiario: ApiarioAtualizadoDTO): Promise<ApiarioRetornoDTO> => {
  try {
    const response = await api.put<ApiarioRetornoDTO>(`/apiarios/${apiarioId}/produtor/${produtorId}`, apiario);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar apiário:', error);
    throw error;
  }
};

export const deletarApiario = async (apiarioId: number, produtorId: number): Promise<void> => {
  try {
    await api.delete(`/apiarios/${apiarioId}/produtor/${produtorId}`);
  } catch (error) {
    console.error('Erro ao deletar apiário:', error);
    throw error;
  }
};

export default {
  listarApiariosPorProdutor,
  cadastrarApiario,
  atualizarApiario,
  deletarApiario,
};
