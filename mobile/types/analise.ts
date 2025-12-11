import type { FiltroOpcao } from './filtros';
import type { ColunaRelatorio } from './relatorio';
import type { GraficoConfig } from './grafico';
import type { Kpi } from './kpi';

export interface AnaliseConfig {
  titulo: string;
  subtitulo?: string;

  // Relatório
  dadosRelatorio: Record<string, any>[];
  colunasRelatorio: ColunaRelatorio[];
  filtros?: {
    ano?: FiltroOpcao[];
    estacao?: FiltroOpcao[];
    mes?: FiltroOpcao[];
    custom?: { label: string; options: FiltroOpcao[] }[];
  };

  // Dashboard
  kpis: Kpi[];
  graficos: GraficoConfig[];
  resumoEstatistico?: Record<string, string>;
}