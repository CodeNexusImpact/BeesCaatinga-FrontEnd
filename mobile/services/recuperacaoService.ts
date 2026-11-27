import api from './api';

/** GET /auth/recuperacao-disponivel → { disponivel } (false se o servidor não tiver e-mail configurado). */
export async function recuperacaoDisponivel(): Promise<boolean> {
  try {
    const { data } = await api.get<{ disponivel: boolean }>('/auth/recuperacao-disponivel');
    return !!data?.disponivel;
  } catch {
    return false;
  }
}

/** POST /auth/recuperar-senha { email } → 202 { mensagem } (503 quando o e-mail não está configurado). */
export async function solicitarCodigo(email: string): Promise<string> {
  const { data } = await api.post<{ mensagem?: string }>('/auth/recuperar-senha', { email: email.trim().toLowerCase() });
  return data?.mensagem || 'Se o e-mail estiver cadastrado, você receberá um código de 6 dígitos.';
}

/** POST /auth/redefinir-senha { email, codigo, novaSenha } → 204; 400 se o código for inválido ou expirado. */
export async function redefinirSenha(email: string, codigo: string, novaSenha: string): Promise<void> {
  await api.post('/auth/redefinir-senha', { email: email.trim().toLowerCase(), codigo: codigo.trim(), novaSenha });
}
