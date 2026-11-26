/** Web: cria um Blob e dispara o download por meio de um link temporário. */
export async function salvarArquivo(dados: ArrayBuffer, nomeArquivo: string, mimeType = 'application/pdf'): Promise<void> {
  const blob = new Blob([dados], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nomeArquivo;
  a.rel = 'noopener';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
