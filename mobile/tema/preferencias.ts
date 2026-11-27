import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Preferências de aparência lidas de forma SÍNCRONA na inicialização (antes de qualquer tela),
 * para que os tokens de cor e o tamanho do texto valham para o app inteiro.
 * Web: localStorage. Celular: expo-secure-store (API síncrona).
 */
export type Tema = 'claro' | 'escuro';
export type TamanhoTexto = 'normal' | 'grande' | 'muito-grande';

export const ESCALAS: Record<TamanhoTexto, number> = { normal: 1, grande: 1.15, 'muito-grande': 1.3 };

const CHAVE_TEMA = 'bees_tema';
const CHAVE_TEXTO = 'bees_tamanho_texto';

function ler(chave: string): string | null {
  try {
    if (Platform.OS === 'web') return typeof localStorage !== 'undefined' ? localStorage.getItem(chave) : null;
    return SecureStore.getItem(chave);
  } catch {
    return null;
  }
}

function gravar(chave: string, valor: string) {
  try {
    if (Platform.OS === 'web') localStorage.setItem(chave, valor);
    else SecureStore.setItem(chave, valor);
  } catch {
    /* sem armazenamento: vale só nesta sessão */
  }
}

const temaSalvo = ler(CHAVE_TEMA);
const textoSalvo = ler(CHAVE_TEXTO);

export const preferencias: { tema: Tema; tamanhoTexto: TamanhoTexto } = {
  tema: temaSalvo === 'escuro' ? 'escuro' : 'claro',
  tamanhoTexto: textoSalvo === 'grande' || textoSalvo === 'muito-grande' ? textoSalvo : 'normal',
};

export const escalaTexto = () => ESCALAS[preferencias.tamanhoTexto];
export const temaEscuro = () => preferencias.tema === 'escuro';

/**
 * Salva e aplica: na web recarrega a página (todas as telas com o novo tema/tamanho);
 * no celular retorna false para a tela pedir que o app seja reaberto.
 */
export function salvarPreferencias(p: Partial<typeof preferencias>): boolean {
  if (p.tema) gravar(CHAVE_TEMA, p.tema);
  if (p.tamanhoTexto) gravar(CHAVE_TEXTO, p.tamanhoTexto);
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.location.reload();
    return true;
  }
  Object.assign(preferencias, p);
  return false;
}
