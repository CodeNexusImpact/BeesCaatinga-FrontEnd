import { Platform } from 'react-native';
import api, { BASE_URL } from './api';

/** URL absoluta de um arquivo enviado (`/arquivos/{id}` → `https://api.../arquivos/{id}`). */
export const urlArquivo = (url?: string | null) => (!url ? '' : /^(https?:|blob:|data:|file:)/.test(url) ? url : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`);

/**
 * Envia uma foto: POST /upload (multipart, campo "file") → { id, url: "/arquivos/{id}" }.
 * Retorna a URL relativa do servidor (`/arquivos/{id}`), que é o valor gravado em `caminhoDaFoto`;
 * para exibir use urlArquivo().
 */
export async function enviarFoto(uri: string, mimeType = 'image/jpeg', nome?: string): Promise<string> {
  const arquivo = nome || `foto_${Date.now()}.${mimeType.split('/')[1] || 'jpg'}`;
  const form = new FormData();
  if (Platform.OS === 'web') {
    const blob = await (await fetch(uri)).blob();
    form.append('file', blob, arquivo);
  } else {
    form.append('file', { uri, name: arquivo, type: mimeType } as any);
  }
  // Sem Content-Type manual: o navegador/axios define o boundary do multipart.
  const { data } = await api.post('/upload', form, { headers: { 'Content-Type': undefined as any }, transformRequest: (d) => d });
  if (!data?.url) throw new Error('Resposta do upload sem URL.');
  return String(data.url);
}
