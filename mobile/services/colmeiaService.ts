import api from './api';
import { atualizarOuEnfileirar, criarOuEnfileirar, lerComCache } from './offline';
import type { ColmeiaRetornoDTO } from '@/types/apiario/colmeia';

export const listarColmeiasPorApiario = async (produtorId: number | string, apiarioId: number | string): Promise<ColmeiaRetornoDTO[]> => {
  if (String(apiarioId).startsWith('local:')) return (await listarColmeiasPorProdutor(produtorId)).filter((c) => String(c.apiarioId) === String(apiarioId));
  return lerComCache(`colmeias:${produtorId}:${apiarioId}`, async () => (await api.get(`/colmeias/produtor/${produtorId}/apiario/${apiarioId}`)).data ?? [], 'colmeia').then(
    (l: any[]) => l.filter((c) => !c.pendente || String(c.apiarioId) === String(apiarioId)),
  );
};

export const listarAtivas = async (produtorId: number | string, apiarioId: number | string) => {
  try {
    const response = await api.get(`/colmeias/produtor/${produtorId}/apiario/${apiarioId}/ativas`);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar colmeias ativas:', error);
    throw error;
  }
};

export const listarInativas = async (produtorId: number | string, apiarioId: number | string) => {
  try {
    const response = await api.get(`/colmeias/produtor/${produtorId}/apiario/${apiarioId}/inativas`);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar colmeias inativas:', error);
    throw error;
  }
};

// O backend não expõe GET /colmeias/{id}: busca na listagem do produtor.
export const buscarColmeiaPorId = async (produtorId: number | string, id: number | string): Promise<ColmeiaRetornoDTO | null> => {
  try {
    const response = await api.get<ColmeiaRetornoDTO[]>(`/colmeias/produtor/${produtorId}`);
    const lista = Array.isArray(response.data) ? response.data : [];
    return lista.find((c) => String(c.id) === String(id)) ?? null;
  } catch (error) {
    console.error(`Erro ao buscar colmeia ${id}:`, error);
    throw error;
  }
};

export const cadastrarColmeia = async (produtorId: number | string, apiarioId: number | string, dados: any, nomeApiario?: string) =>
  criarOuEnfileirar('colmeia', `/colmeias/produtor/${produtorId}/apiario/${apiarioId}`, dados, `Colmeia ${dados?.identificador ?? ''}`, {
    apiarioId,
    nomeApiario: nomeApiario ?? '',
    statusColmeia: dados?.ativa === false ? 'INATIVO' : 'SAUDAVEL',
  });

export const atualizarColmeia = async (produtorId: number | string, apiarioId: number | string, colmeiaId: number | string, dados: any) =>
  atualizarOuEnfileirar('colmeia', `/colmeias/produtor/${produtorId}/apiario/${apiarioId}/colmeia/${colmeiaId}`, dados, `Edição da colmeia ${dados?.identificador ?? ''}`);

export const deletarColmeia = async (produtorId: number | string, apiarioId: number | string, colmeiaId: number | string) => {
  try {
    await api.delete(`/colmeias/produtor/${produtorId}/apiario/${apiarioId}/colmeia/${colmeiaId}`);
  } catch (error) {
    console.error(`Erro ao deletar colmeia ${colmeiaId}:`, error);
    throw error;
  }
};

export const listarColmeiasPorProdutor = async (produtorId: number | string): Promise<ColmeiaRetornoDTO[]> =>
  lerComCache(`colmeias:${produtorId}`, async () => (await api.get(`/colmeias/produtor/${produtorId}`)).data ?? [], 'colmeia');

export default {
  listarColmeiasPorApiario,
  listarColmeiasPorProdutor,
  listarAtivas,
  listarInativas,
  buscarColmeiaPorId,
  cadastrarColmeia,
  atualizarColmeia,
  deletarColmeia,
};
