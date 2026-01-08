export interface Producao {
  loteId: string;
  dataExtracao: string;
  pesoLitro: string;
  apiario: string;
  colmeia: string;
  producaoTotal: string;
}

export interface KpiProducao {
  label: string;
  value: string;
}

export interface GraficoProducao {
  tipo: 'linha' | 'barra' | 'pizza';
  titulo: string;
  dados: any[];
}