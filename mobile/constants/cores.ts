const cores = {
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
        100: '#1AEFAF',
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


const opacity = (hexColor: string, opacityPercent: number) => {
    const opacityHex = Math.round((opacityPercent / 100) * 255).toString(16).padStart(2, '0');
    return hexColor + opacityHex;
}

export default {
    cores,
    primaria: cores.primaria[100],
    primariaHover: cores.primaria[90],
    primariaActive: cores.primaria[80],

    secundariaHover: cores.secundaria[90],
    secundariaActive: cores.secundaria[80],
    secundaria: cores.secundaria[100],

    branco: cores.base[0],
    preto: cores.base[100],

    botaoBranco: cores.base[5],
    botaoBrancoHover: cores.base[10],
    botaoBrancoActive: cores.base[20],

    perigo: cores.complementarNegativa[100],
    alerta: cores.primaria[100],
    sucesso: cores.complementarPositiva[100], 

    texto: cores.base[100],
    fundo: cores.base[0],
    placeholder: cores.base[60],
    sublinhado: cores.secundaria[30], 
    borda: opacity(cores.base[100], 50),        
};