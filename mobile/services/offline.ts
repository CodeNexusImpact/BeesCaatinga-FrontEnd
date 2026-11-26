import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { useSyncExternalStore } from 'react';
import api from './api';

/**
 * Modo híbrido offline/online.
 * - Criações/edições feitas sem internet (ou que falham por erro de rede) vão para uma fila local
 *   (AsyncStorage → localStorage na web) com um UUID do cliente.
 * - "Sincronizar" envia a fila em ordem de dependência (apiário → colmeia → vistoria/produção → lote),
 *   trocando ids locais ("local:<uuid>") pelos ids do servidor e enviando `Idempotency-Key: <uuid>`
 *   nos POSTs, para que uma repetição nunca duplique o registro.
 * - O item só sai da fila quando o servidor confirma. Erros ficam visíveis por item, com nova tentativa.
 * - As últimas listas carregadas ficam em cache para leitura sem internet.
 */

export type TipoRegistro = 'apiario' | 'colmeia' | 'insumo' | 'vistoria' | 'producao' | 'lote' | 'outro';

export interface ItemFila {
  uuid: string;
  tipo: TipoRegistro;
  metodo: 'POST' | 'PUT';
  url: string;
  corpo: any;
  /** Dados para exibir o item nas listas enquanto pendente (nome, apiário etc.). */
  exibicao?: Record<string, any>;
  descricao: string;
  criadoEm: string;
  tentativas: number;
  erro?: string | null;
}

const CHAVE_FILA = '@offline:fila';
const CHAVE_IDS = '@offline:ids';
const PREFIXO_CACHE = '@offline:cache:';
const ORDEM: TipoRegistro[] = ['apiario', 'colmeia', 'insumo', 'vistoria', 'producao', 'lote', 'outro'];
const TEM_LOCAL = /local:[0-9a-f-]{36}/;

let fila: ItemFila[] = [];
let carregada = false;
let sincronizando = false;
const ouvintes = new Set<() => void>();
let instantaneo = { fila, sincronizando };
const avisar = () => {
  instantaneo = { fila, sincronizando };
  ouvintes.forEach((f) => f());
};

export const novoUuid = (): string => {
  const c = (globalThis as any).crypto;
  if (c?.randomUUID) return c.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (ch) => {
    const r = (Math.random() * 16) | 0;
    return (ch === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};

export const idLocal = (uuid: string) => `local:${uuid}`;
export const ehIdLocal = (id: unknown) => typeof id === 'string' && id.startsWith('local:');

export function estaOnline(): boolean {
  if (Platform.OS === 'web' && typeof navigator !== 'undefined' && 'onLine' in navigator) return navigator.onLine;
  return true;
}

/** Erro sem resposta do servidor (sem internet, DNS, CORS de rede, tempo esgotado). */
export const ehErroDeRede = (e: any) => !!e && !e.response && (e.code === 'ERR_NETWORK' || e.code === 'ECONNABORTED' || e.message === 'Network Error' || e.code === 'ETIMEDOUT');

async function carregar() {
  if (carregada) return;
  try {
    const bruto = await AsyncStorage.getItem(CHAVE_FILA);
    const lista = bruto ? JSON.parse(bruto) : [];
    fila = Array.isArray(lista) ? lista : [];
  } catch {
    fila = [];
  }
  carregada = true;
  avisar();
}

async function salvar() {
  await AsyncStorage.setItem(CHAVE_FILA, JSON.stringify(fila));
  avisar();
}

async function mapaIds(): Promise<Record<string, number>> {
  try {
    return JSON.parse((await AsyncStorage.getItem(CHAVE_IDS)) || '{}');
  } catch {
    return {};
  }
}

export async function obterFila(): Promise<ItemFila[]> {
  await carregar();
  return fila;
}

/** Hook: fila atual e se está sincronizando (atualiza a interface automaticamente). */
export function useFilaOffline() {
  return useSyncExternalStore(
    (f) => {
      ouvintes.add(f);
      carregar();
      return () => ouvintes.delete(f);
    },
    () => instantaneo,
    () => instantaneo,
  );
}

async function enfileirar(item: Omit<ItemFila, 'criadoEm' | 'tentativas'>) {
  await carregar();
  fila = [...fila.filter((i) => i.uuid !== item.uuid), { ...item, criadoEm: new Date().toISOString(), tentativas: 0, erro: null }];
  await salvar();
}

/** Itens pendentes de um tipo, no formato das listas (com `pendente: true`). */
export async function pendentesDoTipo(tipo: TipoRegistro): Promise<any[]> {
  await carregar();
  return fila
    .filter((i) => i.tipo === tipo && i.metodo === 'POST')
    .map((i) => ({ ...i.corpo, ...i.exibicao, id: idLocal(i.uuid), pendente: true, erroSincronizacao: i.erro ?? null }));
}

/**
 * POST de criação com fila offline. Online: envia com Idempotency-Key. Sem internet ou erro de rede:
 * guarda na fila e devolve o registro com id local e `pendente: true`.
 */
export async function criarOuEnfileirar<T = any>(
  tipo: TipoRegistro,
  url: string,
  corpo: any,
  descricao: string,
  exibicao?: Record<string, any>,
): Promise<T & { pendente?: boolean }> {
  const uuid = novoUuid();
  const dependeDeLocal = TEM_LOCAL.test(url + JSON.stringify(corpo));
  if (estaOnline() && !dependeDeLocal) {
    try {
      const { data } = await api.post<T>(url, corpo, { headers: { 'Idempotency-Key': uuid } });
      return data as T & { pendente?: boolean };
    } catch (e) {
      if (!ehErroDeRede(e)) throw e;
    }
  }
  await enfileirar({ uuid, tipo, metodo: 'POST', url, corpo, descricao, exibicao });
  return { ...corpo, ...exibicao, id: idLocal(uuid), pendente: true } as any;
}

/** PUT de edição com fila offline (PUT é idempotente; reenviar não duplica). */
export async function atualizarOuEnfileirar<T = any>(tipo: TipoRegistro, url: string, corpo: any, descricao: string): Promise<T & { pendente?: boolean }> {
  if (estaOnline() && !TEM_LOCAL.test(url + JSON.stringify(corpo))) {
    try {
      const { data } = await api.put<T>(url, corpo);
      return data as T & { pendente?: boolean };
    } catch (e) {
      if (!ehErroDeRede(e)) throw e;
    }
  }
  await enfileirar({ uuid: novoUuid(), tipo, metodo: 'PUT', url, corpo, descricao });
  return { ...corpo, pendente: true } as any;
}

/** Troca ids locais pelos do servidor; retorna null se algum ainda não foi sincronizado. */
function resolver(texto: string, ids: Record<string, number>): string | null {
  let faltando = false;
  const r = texto.replace(/"local:([0-9a-f-]{36})"|local:([0-9a-f-]{36})/g, (m, aspas, solto) => {
    const id = ids[aspas ?? solto];
    if (id == null) {
      faltando = true;
      return m;
    }
    return String(id);
  });
  return faltando ? null : r;
}

export interface ResultadoSincronizacao {
  enviados: number;
  pendentes: number;
  erros: number;
  semInternet: boolean;
}

/** Envia a fila em ordem de dependência. Nunca apaga um item sem confirmação do servidor. */
export async function sincronizar(): Promise<ResultadoSincronizacao> {
  await carregar();
  if (sincronizando) return { enviados: 0, pendentes: fila.length, erros: 0, semInternet: false };
  sincronizando = true;
  avisar();
  let enviados = 0;
  let semInternet = false;
  try {
    const ids = await mapaIds();
    const ordenada = [...fila].sort((a, b) => ORDEM.indexOf(a.tipo) - ORDEM.indexOf(b.tipo) || a.criadoEm.localeCompare(b.criadoEm));
    for (const item of ordenada) {
      const url = resolver(item.url, ids);
      const corpoTxt = resolver(JSON.stringify(item.corpo ?? null), ids);
      if (url == null || corpoTxt == null) {
        item.erro = 'Aguardando o envio do registro do qual este depende.';
        continue;
      }
      try {
        const corpo = JSON.parse(corpoTxt);
        const resp =
          item.metodo === 'POST'
            ? await api.post(url, corpo, { headers: { 'Idempotency-Key': item.uuid } })
            : await api.put(url, corpo);
        if (item.metodo === 'POST' && resp.data?.id != null) {
          ids[item.uuid] = resp.data.id;
          await AsyncStorage.setItem(CHAVE_IDS, JSON.stringify(ids));
        }
        fila = fila.filter((i) => i.uuid !== item.uuid);
        enviados++;
        await salvar();
      } catch (e: any) {
        item.tentativas += 1;
        if (ehErroDeRede(e)) {
          item.erro = 'Sem conexão com o servidor.';
          semInternet = true;
          break;
        }
        const msg = e?.response?.data?.message || e?.message || 'Erro ao enviar.';
        const campos = Array.isArray(e?.response?.data?.fieldErrors) ? e.response.data.fieldErrors.map((f: any) => f.message).join(' ') : '';
        item.erro = `${msg}${campos ? ` ${campos}` : ''}`;
      }
    }
  } finally {
    sincronizando = false;
    fila = [...fila];
    await salvar();
  }
  return { enviados, pendentes: fila.length, erros: fila.filter((i) => i.erro).length, semInternet };
}

/** Remove um item da fila (somente por ação explícita do usuário, com confirmação). */
export async function descartarItem(uuid: string) {
  await carregar();
  fila = fila.filter((i) => i.uuid !== uuid);
  await salvar();
}

/**
 * Leitura com cache: online guarda a resposta; sem rede devolve a última lista salva.
 * Os itens pendentes do tipo informado são acrescentados (marcados `pendente: true`).
 */
export async function lerComCache<T>(chave: string, buscar: () => Promise<T[]>, tipoPendentes?: TipoRegistro): Promise<T[]> {
  let dados: T[];
  try {
    dados = await buscar();
    AsyncStorage.setItem(PREFIXO_CACHE + chave, JSON.stringify(dados)).catch(() => {});
  } catch (e) {
    if (!ehErroDeRede(e)) throw e;
    // Sem rede: última lista salva; sem cache, lista vazia (os pendentes do aparelho ainda aparecem).
    const bruto = await AsyncStorage.getItem(PREFIXO_CACHE + chave).catch(() => null);
    dados = bruto ? JSON.parse(bruto) : [];
  }
  if (!tipoPendentes) return dados;
  const pend = await pendentesDoTipo(tipoPendentes);
  return [...dados, ...(pend as T[])];
}

// Web: sincroniza automaticamente quando a conexão volta.
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    obterFila().then((f) => {
      if (f.length) sincronizar();
    });
  });
}
