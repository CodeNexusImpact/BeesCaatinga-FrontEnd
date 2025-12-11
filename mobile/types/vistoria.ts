export interface Vistoria {
  dataInspeção: string;
  pragas: string;
  perdas: string;
  observacoes: string;
  statusColmeia: string;
}

export interface KpiVistoria {
  label: string;
  value: string;
}

export interface GraficoVistoria {
  tipo: 'linha' | 'barra' | 'pizza';
  titulo: string;
  dados: any[];
}