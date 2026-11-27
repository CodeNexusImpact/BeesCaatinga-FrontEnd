import { temaEscuro } from '@/tema/preferencias';
export const cores = {
    base: {
        0: '#FFFFFF',
        5: '#F7F8FA',
        10: '#F1F2F4',
        20: '#E1E3E6',
        30: '#C7C9CC',
        40: '#ACAFB3',
        50: '#929598',
        60: '#777B80',
        70: '#5C6065',
        80: '#414447',
        90: '#26292B',
        100: '#000000',
    },
    primaria: {
        100: '#EFAF1A',
        90: '#f1b731',
        80: '#f2bf48',
        70: '#f4c75e',
        60: '#f5cf75',
        50: '#f7d78b',
        40: '#f9dfa3',
        30: '#fae7bb',
        20: '#fcefd0',
        10: '#fdf7e9',
        5: '#fefbf3',
    },
    secundaria: {
        100: '#1A5AEF',
        90: '#3a6ff1',
        80: '#4f7bf2',
        70: '#6690f3',
        60: '#7d9ff4',
        50: '#94aff5',
        40: '#abc0f6',
        30: '#c2d1f7',
        20: '#d9e2f8',
        10: '#f0f2f9',
        5: '#f7f8fb',
    },
    terciaria: {
        100: '#7D4CDB', // Roxo/roxo-escuro (exemplo)
        90: '#8a5fe0',
        80: '#9772e6',
        70: '#a485eb',
        60: '#b198f0',
        50: '#bebaf6',
        40: '#cccdfb',
        30: '#dad0fe',
        20: '#e8e3ff',
        10: '#f4f1fd',
        5: '#faf7ff',
    },
    complementarNegativa: {
        100: '#EF1A5A',
        90: '#f13a73',
        80: '#f24f85',
        70: '#f36698',
        60: '#f47dab',
        50: '#f594bf',
        40: '#f6abcf',
        30: '#f7c2d9',
        20: '#f8d9e5',
        10: '#f9f0f2',
        5: '#fbf7f9',
    },
    complementarPositiva: {
        100: '#13b213ff',
        90: '#3af1c7',
        80: '#4ff2d3',
        70: '#66f3de',
        60: '#7df4e8',
        50: '#94f5f1',
        40: '#abf6f6',
        30: '#c2f7f9',
        20: '#d9f8fb',
        10: '#f0f9fc',
        5: '#f7fbfd',
    },
};



/**
 * Identidade BeesCaatinga: amarelo-mel + marrom escuro.
 * Pares de cor pensados para contraste WCAG AA (texto marrom sobre mel; branco sobre marrom).
 */
const escuro = temaEscuro();

export const identidade = {
    mel: '#F0B21A',
    melClaro: '#FFF4D6',
    marrom: '#5D4037',
    marromEscuro: '#3E2723',
    creme: escuro ? '#151311' : '#FFFBF2',
    superficie: escuro ? '#221E1B' : '#FFFFFF',
    texto: escuro ? '#F3EEE8' : '#1F1A17',
    textoSecundario: escuro ? '#CFC6BC' : '#4A4A4A',
    borda: escuro ? '#6A6056' : '#8A7F72',
    perigo: '#B71C1C',
    sucesso: '#2E7D32',
    aviso: '#8D5B00',
};

export const temaCores = {
    cores,
    identidade,
    primaria: identidade.mel,
    primariaHover: cores.primaria[90],
    primariaActive: cores.primaria[80],

    secundariaHover: cores.secundaria[90],
    secundariaActive: cores.secundaria[80],
    secundaria: escuro ? '#8D6E63' : identidade.marrom,
    superficie: identidade.superficie,
    escuro,
    terciaria: cores.terciaria[100],

    branco: cores.base[0],
    preto: cores.base[100],

    botaoBranco: cores.base[5],
    botaoBrancoHover: cores.base[10],
    botaoBrancoActive: cores.base[20],

    perigo: identidade.perigo,
    alerta: cores.primaria[100],
    sucesso: identidade.sucesso,

    texto: identidade.texto,
    textoSecundario: identidade.textoSecundario,
    textoSobrePrimaria: identidade.marromEscuro,
    fundo: identidade.creme,
    placeholder: escuro ? '#B5ACA2' : '#6B6B6B',
    sublinhado: cores.secundaria[30],
    borda: identidade.borda,
};

export default temaCores