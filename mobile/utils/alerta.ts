import { Alert, AlertButton, Platform } from 'react-native';

/**
 * Alerta multiplataforma.
 * - Nativo: Alert.alert.
 * - Web: react-native-web implementa Alert.alert como no-op, então usamos
 *   window.alert (informativo) e window.confirm (confirmação com 2+ botões),
 *   executando o onPress do botão escolhido.
 */
export function alerta(titulo: string, mensagem?: string, botoes?: AlertButton[]) {
  if (Platform.OS !== 'web') {
    Alert.alert(titulo, mensagem, botoes);
    return;
  }
  if (typeof window === 'undefined') return;

  const texto = [titulo, mensagem].filter(Boolean).join('\n\n');
  const lista = botoes ?? [];
  const cancelar = lista.find((b) => b.style === 'cancel');
  const acoes = lista.filter((b) => b.style !== 'cancel');

  if (lista.length > 1 && acoes.length > 0) {
    if (window.confirm(texto)) acoes[acoes.length - 1].onPress?.();
    else cancelar?.onPress?.();
    return;
  }
  window.alert(texto);
  lista[0]?.onPress?.();
}
