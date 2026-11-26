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
