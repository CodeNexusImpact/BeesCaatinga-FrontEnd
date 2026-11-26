import { Alert, AlertButton, Platform } from 'react-native';

/**
 * No react-native-web, `Alert.alert` não faz nada: mensagens de erro/sucesso e
 * confirmações (ex.: excluir, sair) eram silenciosamente ignoradas no navegador.
 * Este polyfill usa window.alert / window.confirm e executa o callback do botão.
 */
export function instalarAlertWeb() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;

  Alert.alert = (titulo: string, mensagem?: string, botoes?: AlertButton[]) => {
    const texto = [titulo, mensagem].filter(Boolean).join('\n\n');
    const acoes = (botoes ?? []).filter((b) => b.style !== 'cancel');
    const cancelar = (botoes ?? []).find((b) => b.style === 'cancel');

    if (botoes && botoes.length > 1 && acoes.length > 0) {
      if (window.confirm(texto)) acoes[acoes.length - 1].onPress?.();
      else cancelar?.onPress?.();
      return;
    }
    window.alert(texto);
    botoes?.[0]?.onPress?.();
  };
}
