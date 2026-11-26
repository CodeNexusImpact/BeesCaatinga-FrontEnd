import api from './api';
import { atualizarOuEnfileirar, criarOuEnfileirar, lerComCache } from './offline';
import { ApiarioCriadoDTO, ApiarioRetornoDTO, ApiarioAtualizadoDTO } from '@/types/apiario';

export const listarApiariosPorProdutor = async (produtorId: number | string): Promise<ApiarioRetornoDTO[]> =>
  lerComCache(`apiarios:${produtorId}`, async () => (await api.get<ApiarioRetornoDTO[]>(`/apiarios/${produtorId}`)).data ?? [], 'apiario');

export const cadastrarApiario = async (produtorId: number, apiario: ApiarioCriadoDTO): Promise<ApiarioRetornoDTO & { pendente?: boolean }> =>
  criarOuEnfileirar<ApiarioRetornoDTO>('apiario', `/apiarios/${produtorId}`, apiario, `Apiário ${apiario.nome}`, { colmeias: [] });

export const atualizarApiario = async (apiarioId: number, produtorId: number, apiario: ApiarioAtualizadoDTO): Promise<ApiarioRetornoDTO & { pendente?: boolean }> =>
  atualizarOuEnfileirar<ApiarioRetornoDTO>('apiario', `/apiarios/${apiarioId}/produtor/${produtorId}`, apiario, `Edição do apiário ${apiario.nome ?? ''}`);

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
