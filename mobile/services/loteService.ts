import api from './api';
import { criarOuEnfileirar, lerComCache } from './offline';
import { brParaIso } from '@/utils/datas';

export const listarLotes = async (produtorId: number | string) => {
  try {
    const response = await api.get(`/lotes/${produtorId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar lotes resumido:', error);
    throw error;
  }
};

export const listarLotesDetalhado = async (produtorId: number | string): Promise<any[]> =>
  lerComCache(`lotes:${produtorId}`, async () => {
    const { data } = await api.get(`/lotes/${produtorId}/detalhado`);
    return Array.isArray(data) ? data : [];
  }, 'lote');

export const cadastrarLote = async (produtorId: number | string, dados: any) =>
  criarOuEnfileirar('lote', `/lotes/${produtorId}`, dados, `Lote de ${dados?.dataProducao ?? ''}`, { dataProducao: brParaIso(dados?.dataProducao) });

export default {
  listarLotes,
  listarLotesDetalhado,
  cadastrarLote,
};

/** Ids das colmeias de um lote (novo contrato `colmeias[]`, ou `colmeiaId` único). */
export const idsColmeiasDoLote = (l: any): number[] =>
  Array.isArray(l?.colmeias) && l.colmeias.length ? l.colmeias.map((c: any) => c.id) : l?.colmeiaId != null ? [l.colmeiaId] : [];

/** PUT /lotes/{produtorId}/{id}. */
export const atualizarLote = async (produtorId: number | string, id: number | string, dados: any) =>
  (await api.put(`/lotes/${produtorId}/${id}`, dados)).data;

/** DELETE /lotes/{produtorId}/{id}. */
export const excluirLote = async (produtorId: number | string, id: number | string) => {
  await api.delete(`/lotes/${produtorId}/${id}`);
};
