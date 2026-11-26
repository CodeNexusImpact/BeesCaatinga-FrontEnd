import type { useRouter } from 'expo-router';

type Roteador = ReturnType<typeof useRouter>;

/**
 * Volta para a tela anterior ou, se não houver histórico (link direto / recarga no navegador),
 * navega para a rota de fallback. Evita o erro "GO_BACK was not handled".
 */
export function voltar(router: Roteador, fallback: Parameters<Roteador['replace']>[0] = '/') {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}
