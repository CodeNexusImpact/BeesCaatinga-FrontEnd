import { Platform, StyleSheet } from 'react-native';
import { escalaTexto, temaEscuro } from './preferencias';

/**
 * Aplica tema escuro e tamanho do texto no app inteiro.
 * Executado no ponto de entrada (index.js) ANTES das telas: ajusta os estilos criados com
 * StyleSheet.create — tamanhos de fonte proporcionais e cores claras trocadas pelas do tema escuro.
 */
const FUNDOS: Record<string, string> = {
  '#ffffff': '#221E1B', '#fff': '#221E1B', white: '#221E1B',
  '#fffbf2': '#151311', '#f7f8fa': '#1B1816', '#f1f2f4': '#1B1816', '#f9f9f9': '#2A2521', '#f5f5f5': '#2A2521',
  '#f0f0f0': '#3A332D', '#eeeeee': '#2A2521', '#eee': '#2A2521', '#fafafa': '#2A2521', '#e5e3df': '#2A2521',
  '#fdf7e9': '#3A2F1A', '#fcefd0': '#4A3A1C', '#fff4d6': '#3A2F1A', '#fff3cd': '#4A3A1C', '#fdecea': '#4A1F1C',
  '#e1e3e6': '#3A332D',
};
const TEXTOS: Record<string, string> = {
  '#000': '#F3EEE8', '#000000': '#F3EEE8', black: '#F3EEE8', '#1f1a17': '#F3EEE8', '#333': '#E8E1D9', '#333333': '#E8E1D9',
  '#3e2723': '#F3EEE8', '#4a4a4a': '#CFC6BC', '#555': '#CFC6BC', '#555555': '#CFC6BC', '#666': '#C2B9AF', '#666666': '#C2B9AF',
  '#6b6b6b': '#B5ACA2', '#767676': '#B5ACA2', '#777': '#B5ACA2', '#7f7f7f': '#B5ACA2', '#888': '#ADA49A', '#999': '#A39A90',
};
const BORDAS: Record<string, string> = {
  '#ccc': '#4E463E', '#cccccc': '#4E463E', '#ddd': '#4E463E', '#dddddd': '#4E463E', '#eee': '#3A332D', '#e0e0e0': '#3A332D',
  '#8a7f72': '#6A6056', '#8a8a8a': '#6A6056', '#999': '#6A6056', '#e3e3e3': '#3A332D', '#e1e3e6': '#3A332D', '#c7c9cc': '#4E463E',
};

const CORES_TEXTO = new Set(['color', 'placeholderTextColor', 'tintColor']);
const CORES_BORDA = new Set(['borderColor', 'borderTopColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor']);

function ajustar(estilo: any, escala: number, escuro: boolean) {
  if (!estilo || typeof estilo !== 'object' || Array.isArray(estilo)) return estilo;
  const novo: any = { ...estilo };
  if (escala !== 1) {
    if (typeof novo.fontSize === 'number') novo.fontSize = Math.round(novo.fontSize * escala);
    if (typeof novo.lineHeight === 'number') novo.lineHeight = Math.round(novo.lineHeight * escala);
  }
  if (escuro) {
    for (const [prop, valor] of Object.entries(novo)) {
      if (typeof valor !== 'string') continue;
      const v = valor.toLowerCase();
      if (prop === 'backgroundColor' && FUNDOS[v]) novo[prop] = FUNDOS[v];
      else if (CORES_TEXTO.has(prop) && TEXTOS[v]) novo[prop] = TEXTOS[v];
      else if (CORES_BORDA.has(prop) && BORDAS[v]) novo[prop] = BORDAS[v];
    }
  }
  return novo;
}

const escala = escalaTexto();
const escuro = temaEscuro();

if (escala !== 1 || escuro) {
  const criar = StyleSheet.create;
  (StyleSheet as any).create = (estilos: Record<string, any>) => {
    const ajustados: Record<string, any> = {};
    for (const [nome, estilo] of Object.entries(estilos)) ajustados[nome] = ajustar(estilo, escala, escuro);
    return criar(ajustados);
  };
}

// Web: cor de texto padrão, esquema de cores dos controles nativos e fundo da página.
if (Platform.OS === 'web' && typeof document !== 'undefined' && escuro) {
  const css = document.createElement('style');
  css.textContent = 'html,body{background:#151311;color:#F3EEE8;color-scheme:dark}';
  document.head.appendChild(css);
}

export { ajustar };
