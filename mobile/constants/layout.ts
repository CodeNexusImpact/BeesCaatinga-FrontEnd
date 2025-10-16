// src/constants/Layout.ts
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Tamanho base para consistência de espaçamento (ex: 8px)
const espacamentoBase = 8;

export default {
  window: {
    width,
    height,
  },
  
  // Espaçamentos e Margens
  espacamento: {
    unidos: espacamentoBase - espacamentoBase, // 0
    minimo: espacamentoBase/espacamentoBase,     // 1
    texto: espacamentoBase/2, // 4
    amigavel: espacamentoBase, //8
    colega: espacamentoBase * 2, // 16
    social: espacamentoBase * 3, // 24
    chefe: espacamentoBase * 6, // 48
  },
  
  // Tamanhos de Botões e Componentes
  buttonHeight: 48,
  
  // Raio de Borda
  borderRadius:{
    r25: 8,
    r50: 16,
    r75: 24,
    r100: 32,
    r1000: 999,
  }
  
};