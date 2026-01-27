export interface GraficoConfig {
  tipo: 'linha' | 'barra' | 'pizza';
  titulo: string;
  dados: Record<string, any>[];
}