import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

/**
 * Conversão kg ↔ litros do mel.
 * Densidade padrão: 1,42 kg/L (mel a 20 °C; faixa típica 1,38–1,45; mel de abelhas sem ferrão é mais leve).
 * O produtor pode ajustar em Configurações (salvo localmente e, se o backend expuser, em `densidadeMel`).
 */
export const DENSIDADE_PADRAO = 1.42;
export const DENSIDADE_MIN = 1.3;
export const DENSIDADE_MAX = 1.5;
const CHAVE = '@config_densidade_mel';

let densidade = DENSIDADE_PADRAO;
const ouvintes = new Set<() => void>();
const avisar = () => ouvintes.forEach((f) => f());

export const densidadeValida = (d: number) => Number.isFinite(d) && d >= DENSIDADE_MIN && d <= DENSIDADE_MAX;

export function getDensidadeMel() {
  return densidade;
}

/** Define a densidade (memória + armazenamento local). Valores fora da faixa são ignorados. */
export async function setDensidadeMel(d: number, persistir = true) {
  if (!densidadeValida(d)) return false;
  densidade = d;
  avisar();
  if (persistir) await AsyncStorage.setItem(CHAVE, String(d)).catch(() => {});
  return true;
}

/** Carrega a densidade salva localmente (chamado na inicialização do app). */
export async function carregarDensidadeMel() {
  try {
    const salvo = Number(await AsyncStorage.getItem(CHAVE));
    if (densidadeValida(salvo)) {
      densidade = salvo;
      avisar();
    }
  } catch {
    /* mantém o padrão */
  }
}

/** Hook reativo: re-renderiza quando a densidade muda. */
export function useDensidadeMel() {
  return useSyncExternalStore(
    (f) => {
      ouvintes.add(f);
      return () => ouvintes.delete(f);
    },
    getDensidadeMel,
    getDensidadeMel,
  );
}

export const kgParaLitros = (kg: number, d = densidade) => kg / d;
export const litrosParaKg = (l: number, d = densidade) => l * d;

/** Converte qualquer unidade de massa/volume de mel para kg. */
export function paraKg(quantidade: number, unidade?: string | null, d = densidade) {
  const q = Number(quantidade) || 0;
  switch (unidade) {
    case 'GRAMA': return q / 1000;
    case 'LITRO': return litrosParaKg(q, d);
    case 'MILILITRO': return litrosParaKg(q / 1000, d);
    default: return q;
  }
}

/** Número pt-BR com casas fixas (padrão 2): 12,50. */
export const formatarNumero = (n: number, casas = 2) =>
  (Number.isFinite(n) ? n : 0).toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });

/** "12,50 kg (8,80 L)" */
export const formatarKgL = (kg: number, d = densidade) => `${formatarNumero(kg)} kg (${formatarNumero(kgParaLitros(kg, d))} L)`;

/** Converte texto digitado ("12,5" ou "12.5") em número; NaN quando vazio/inválido. */
export const lerDecimal = (t: string) => {
  const limpo = String(t ?? '').trim().replace(/\./g, (m, i, s) => (s.includes(',') ? '' : m)).replace(',', '.');
  return limpo === '' ? NaN : Number(limpo);
};

/** Texto de entrada a partir de número (2 casas, vírgula). */
export const paraTexto = (n: number) => (Number.isFinite(n) ? formatarNumero(n).replace(/\./g, '') : '');
