import api from './api';
import { atualizarOuEnfileirar, criarOuEnfileirar, lerComCache } from './offline';
import { brParaIso } from '@/utils/datas';
import type { ProducaoRetornoDTO, ProducaoCriadaDTO, ProducaoAtualizadaDTO } from '@/types/producao';

export const listarProducoes = async (produtorId: number | string): Promise<ProducaoRetornoDTO[]> =>
  lerComCache(`producoes:${produtorId}`, async () => {
    const { data } = await api.get<ProducaoRetornoDTO[]>(`/producoes/${produtorId}`);
    return Array.isArray(data) ? data : [];
  }, 'producao');

export const getProducoes = listarProducoes;

// O backend não expõe GET por id: busca na listagem do produtor.
export const getProducaoPorId = async (produtorId: number | string, producaoId: number | string): Promise<ProducaoRetornoDTO | null> =>
  (await listarProducoes(produtorId)).find((p) => String(p.id) === String(producaoId)) ?? null;

export const cadastrarProducao = async (
  produtorId: number | string,
  dto: ProducaoCriadaDTO,
  exibicao?: { nomeApiario?: string; nomeColmeia?: string },
): Promise<ProducaoRetornoDTO & { pendente?: boolean }> =>
  criarOuEnfileirar<ProducaoRetornoDTO>('producao', `/producoes/${produtorId}`, dto, `Produção de ${dto.dataColeta ?? ''}`, { ...exibicao, dataColeta: brParaIso(String(dto.dataColeta ?? '')) });

export const atualizarProducao = async (producaoId: number | string, produtorId: number | string, dto: ProducaoAtualizadaDTO): Promise<ProducaoRetornoDTO & { pendente?: boolean }> =>
  atualizarOuEnfileirar<ProducaoRetornoDTO>('producao', `/producoes/${producaoId}/produtor/${produtorId}`, dto, `Edição da produção ${producaoId}`);

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
