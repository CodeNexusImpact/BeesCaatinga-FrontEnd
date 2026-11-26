import api from './api';
import { salvarArquivo } from '@/utils/salvarArquivo';

/** Filtro aceito pelos endpoints /relatorios/* (FiltroBuscaDTO do backend). */
export interface FiltroRelatorio {
  ano?: number | null;
  estacao?: string | null;
  mes?: number | null;
  apiarioId?: number | null;
  colmeiaId?: number | null;
}

export type TipoRelatorio = 'producao' | 'vistorias' | 'rastreabilidade';

export const gerarRelatorioProducao = async (filtro: FiltroRelatorio = {}) => (await api.post('/relatorios/producao', filtro)).data;
export const gerarRelatorioVistoria = async (filtro: FiltroRelatorio = {}) => (await api.post('/relatorios/vistorias', filtro)).data;
export const gerarRelatorioRastreabilidade = async (filtro: FiltroRelatorio = {}) =>
  (await api.post('/relatorios/rastreabilidade', filtro)).data;

/** Extrai o nome do arquivo do cabeçalho Content-Disposition (attachment; filename="x.pdf"). */
export const nomeDoArquivo = (contentDisposition: string | undefined, padrao: string) => {
  if (!contentDisposition) return padrao;
  const utf8 = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition);
  if (utf8) return decodeURIComponent(utf8[1].trim());
  const simples = /filename="?([^";]+)"?/i.exec(contentDisposition);
  return simples ? simples[1].trim() : padrao;
};

/** Converte o corpo de erro (ArrayBuffer) de uma resposta binária em mensagem legível. */
const mensagemDeErroBinario = (dados: unknown): string | null => {
  try {
    if (dados instanceof ArrayBuffer) {
      const texto = new TextDecoder().decode(dados);
      const json = JSON.parse(texto);
      return json?.message || json?.erro || json?.error || texto;
    }
  } catch {
    /* corpo não é JSON */
  }
  return null;
};

/**
 * POST /relatorios/{tipo}/pdf com o mesmo corpo do relatório JSON; recebe application/pdf
 * e salva (web: download; nativo: compartilhar). Retorna o nome do arquivo salvo.
 */
export const exportarRelatorioPdf = async (tipo: TipoRelatorio, filtro: FiltroRelatorio = {}): Promise<string> => {
  try {
    const resp = await api.post<ArrayBuffer>(`/relatorios/${tipo}/pdf`, filtro, {
      responseType: 'arraybuffer',
      headers: { Accept: 'application/pdf' },
    });
    const data = new Date().toISOString().slice(0, 10);
    const nome = nomeDoArquivo(resp.headers?.['content-disposition'], `relatorio-${tipo}-${data}.pdf`);
    await salvarArquivo(resp.data, nome, 'application/pdf');
    return nome;
  } catch (error: any) {
    const status = error?.response?.status;
    const msg = mensagemDeErroBinario(error?.response?.data);
    if (status === 404) throw new Error('A exportação em PDF ainda não está disponível no servidor.');
    throw new Error(msg || error?.message || 'Não foi possível exportar o PDF.');
  }
};

export default {
  gerarRelatorioProducao,
  gerarRelatorioVistoria,
  gerarRelatorioRastreabilidade,
  exportarRelatorioPdf,
};
