import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

/**
 * Nativo (Android/iOS): grava o arquivo no cache do app e abre a folha de compartilhamento
 * para o usuário salvar ou enviar o PDF. A versão web fica em salvarArquivo.web.ts.
 */
export async function salvarArquivo(dados: ArrayBuffer, nomeArquivo: string, mimeType = 'application/pdf'): Promise<void> {
  const arquivo = new File(Paths.cache, nomeArquivo);
  if (arquivo.exists) arquivo.delete();
  arquivo.create();
  arquivo.write(new Uint8Array(dados));
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(arquivo.uri, { mimeType, dialogTitle: nomeArquivo, UTI: 'com.adobe.pdf' });
  }
}
