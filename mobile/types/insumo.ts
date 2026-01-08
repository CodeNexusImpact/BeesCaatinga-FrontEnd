export interface Insumo {
  dataEntrada: string;
  nomeInsumo: string;
  tipoInsumo: string;
  quantidade: string;
  unidadeMedida: string;
  status: string;
}

export interface KpiInsumo {
  label: string;
  value: string;
}

export interface GraficoInsumo {
  tipo: 'linha' | 'barra' | 'pizza';
  titulo: string;
  dados: any[];
}