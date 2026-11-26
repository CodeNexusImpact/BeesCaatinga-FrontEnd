import api from './api';

/** Campos aceitos por GET /sugestoes (lista branca do backend). */
export type CampoSugestao =
  | 'cidade' | 'estado' | 'bairro' | 'nomeDaPropriedade' | 'nomeApiario' | 'identificadorColmeia'
  | 'tipoInsumo' | 'nomeInsumo' | 'tipoProducao' | 'floradas' | 'tipoAbelha';

const cache = new Map<string, string[]>();

/** Valores já cadastrados pelo produtor (máx. 20). Falhas/offline retornam lista vazia. */
export async function buscarSugestoes(campo: CampoSugestao, q = ''): Promise<string[]> {
  const chave = `${campo}|${q.toLowerCase()}`;
  if (cache.has(chave)) return cache.get(chave)!;
  try {
    const { data } = await api.get<string[]>('/sugestoes', { params: { campo, q } });
    const lista = Array.isArray(data) ? data.filter((v) => typeof v === 'string') : [];
    cache.set(chave, lista);
    return lista;
  } catch {
    return [];
  }
}

export const limparCacheSugestoes = () => cache.clear();
