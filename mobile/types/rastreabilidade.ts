export interface Rastreabilidade {
  id: string;
  dataProducao: string;
  quantidadeProduzida: string;
  tratamento: string;
  localidade: string;
  tipoAbelhas: string;
}

export interface KpiRastreabilidade {
  label: string;
  value: string;
}

export interface GraficoRastreabilidade {
  tipo: 'linha' | 'barra' | 'pizza';
  titulo: string;
  dados: any[];
}