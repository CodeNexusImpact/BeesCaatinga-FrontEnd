/** Extrai a mensagem do ErrorResponse do backend ({ status, error, message, fieldErrors? }). */
export function mensagemDeErro(error: any, padrao: string): string {
  const dados = error?.response?.data;
  if (dados && typeof dados === 'object') {
    const campos = Array.isArray(dados.fieldErrors)
      ? dados.fieldErrors.map((f: any) => f?.mensagem || f?.message || f?.defaultMessage).filter(Boolean)
      : [];
    if (campos.length) return campos.join('\n');
    if (dados.message) return String(dados.message);
  }
  if (error?.code === 'ECONNABORTED') return 'O servidor demorou a responder. Tente novamente em instantes.';
  if (error?.message === 'Network Error') return 'Sem conexão com o servidor. Verifique sua internet.';
  if (error instanceof Error && error.message && !/status code/i.test(error.message)) return error.message;
  return padrao;
}
