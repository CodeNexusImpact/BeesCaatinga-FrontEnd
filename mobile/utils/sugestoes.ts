import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Sugestões inteligentes: lembra a última escolha de cada seletor e um histórico de valores
 * digitados por campo (local), combinados com os valores já cadastrados pelo produtor (API).
 */
const PREFIXO_ESCOLHA = '@ultima_escolha:';
const PREFIXO_HIST = '@historico:';
const MAX_HIST = 30;

export async function lembrarEscolha(campo: string, valor: string) {
  if (!valor) return;
  await AsyncStorage.setItem(PREFIXO_ESCOLHA + campo, valor).catch(() => {});
}

export async function ultimaEscolha(campo: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(PREFIXO_ESCOLHA + campo);
  } catch {
    return null;
  }
}

export async function lerHistorico(campo: string): Promise<string[]> {
  try {
    const bruto = await AsyncStorage.getItem(PREFIXO_HIST + campo);
    const lista = bruto ? JSON.parse(bruto) : [];
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

/** Registra valores digitados (os mais recentes primeiro, sem repetição). */
export async function registrarHistorico(campo: string, ...valores: (string | null | undefined)[]) {
  const novos = valores.map((v) => String(v ?? '').trim()).filter(Boolean);
  if (!novos.length) return;
  const atual = await lerHistorico(campo);
  const lista = [...novos, ...atual.filter((v) => !novos.some((n) => n.toLowerCase() === v.toLowerCase()))].slice(0, MAX_HIST);
  await AsyncStorage.setItem(PREFIXO_HIST + campo, JSON.stringify(lista)).catch(() => {});
}

const semAcento = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Filtra sugestões pelo texto digitado (ignora acentos/maiúsculas), por frequência. */
export function filtrarSugestoes(candidatos: (string | null | undefined)[], texto: string, limite = 5): string[] {
  const freq = new Map<string, number>();
  const original = new Map<string, string>();
  candidatos.forEach((c) => {
    const v = String(c ?? '').trim();
    if (!v) return;
    const k = semAcento(v);
    freq.set(k, (freq.get(k) ?? 0) + 1);
    if (!original.has(k)) original.set(k, v);
  });
  const t = semAcento(texto.trim());
  return [...freq.entries()]
    .filter(([k]) => (t ? k.includes(t) && k !== t : true))
    .sort((a, b) => b[1] - a[1])
    .slice(0, limite)
    .map(([k]) => original.get(k)!);
}
