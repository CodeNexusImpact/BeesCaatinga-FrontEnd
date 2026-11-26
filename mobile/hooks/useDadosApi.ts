import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { mensagemDeErro } from '@/utils/erros';

/**
 * Carrega dados do produtor logado sempre que a tela ganha foco.
 * `buscar` deve ser uma função estável (declarada fora do componente).
 * Retorna estados de carregamento/erro padronizados para as telas.
 */
export function useDadosApi<T>(buscar: (produtorId: number) => Promise<T>, inicial: T) {
  const { user } = useAuth();
  const produtorId = user?.id ? Number(user.id) : null;
  const [dados, setDados] = useState<T>(inicial);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    if (!produtorId) return;
    setCarregando(true);
    try {
      setDados(await buscar(produtorId));
      setErro(null);
    } catch (e) {
      setErro(mensagemDeErro(e, 'Não foi possível carregar os dados. Verifique sua conexão.'));
    } finally {
      setCarregando(false);
    }
  }, [produtorId, buscar]);

  useFocusEffect(
    useCallback(() => {
      recarregar();
    }, [recarregar]),
  );

  return { dados, carregando, erro, recarregar, produtorId };
}
