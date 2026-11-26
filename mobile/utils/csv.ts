import { salvarArquivo } from './salvarArquivo';

const celula = (v: unknown) => {
  const t = v == null ? '' : String(v);
  return /[;"\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
};

/** Gera CSV (separador ";" e BOM UTF-8, abre corretamente no Excel em pt-BR) e baixa/compartilha. */
export interface ColunaCsv<T> {
  label: string;
  dataKey: keyof T | string;
  render?: (item: T) => unknown;
}

export async function exportarCsv<T>(nomeArquivo: string, colunas: ColunaCsv<T>[], linhas: T[]) {
  const valor = (l: T, c: ColunaCsv<T>) => {
    const r = c.render?.(l);
    return typeof r === 'string' || typeof r === 'number' ? r : (l as any)[c.dataKey];
  };
  const texto = [colunas.map((c) => celula(c.label)).join(';'), ...linhas.map((l) => colunas.map((c) => celula(valor(l, c))).join(';'))].join('\r\n');
  const bytes = new TextEncoder().encode('﻿' + texto);
  await salvarArquivo(bytes.buffer as ArrayBuffer, nomeArquivo, 'text/csv');
}
