import { useState, useEffect } from 'react';
import type { Producao, KpiProducao, GraficoProducao } from '@/types/producao';

interface UseProducaoResult {
  data: Producao[];
  kpis: KpiProducao[];
  graficos: GraficoProducao[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useProducao = (filtros: any = {}): UseProducaoResult => {
  const [data, setData] = useState<Producao[]>([]);
  const [kpis, setKpis] = useState<KpiProducao[]>([]);
  const [graficos, setGraficos] = useState<GraficoProducao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dados simulados (fixos para todos os usuários)
  const mockData: Producao[] = [
    { loteId: 'ID-01', dataExtracao: '20/06/2025', pesoLitro: '1.3', apiario: 'Serra do Mel', colmeia: 'C1', producaoTotal: '100' },
    { loteId: 'ID-02', dataExtracao: '04/07/2025', pesoLitro: '1.7', apiario: 'Vale das Abelhas', colmeia: 'C2', producaoTotal: '120' },
    { loteId: 'ID-03', dataExtracao: '15/08/2025', pesoLitro: '2.0', apiario: 'Rosa do Sertão', colmeia: 'C3', producaoTotal: '150' },
    { loteId: 'ID-04', dataExtracao: '03/06/2024', pesoLitro: '4.6', apiario: 'Apiário Central', colmeia: 'C5', producaoTotal: '200' },
  ];

  const mockKpis: KpiProducao[] = [
    { label: 'Produção Total', value: '570 kg' },
    { label: 'Média/Colmeia', value: '142.5 kg' },
  ];

  const mockGraficos: GraficoProducao[] = [
    {
      tipo: 'linha',
      titulo: 'Produção Mensal (kg)',
      dados: [
        { mes: 'Jun', producao: 100 },
        { mes: 'Jul', producao: 120 },
        { mes: 'Ago', producao: 150 },
        { mes: 'Jun-24', producao: 200 },
      ],
    },
    {
      tipo: 'barra',
      titulo: 'Status das Colmeias',
      dados: [
        { status: 'Saudável', quantidade: 4, cor: '#2ecc71' },
        { status: 'Crítica', quantidade: 0, cor: '#e74c3c' },
      ],
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      // Aplica filtros (simulação simples)
      let filteredData = [...mockData];
      if (filtros.ano) {
        filteredData = filteredData.filter(item => item.dataExtracao.includes(filtros.ano));
      }
      if (filtros.mes) {
        const mesPreenchido = filtros.mes.padStart(2, '0');
        filteredData = filteredData.filter(item => item.dataExtracao.includes(`/${mesPreenchido}/`));
      }
      if (filtros.apiario) {
        filteredData = filteredData.filter(item => item.apiario === filtros.apiario);
      }

      setData(filteredData);
      setKpis(mockKpis);
      setGraficos(mockGraficos);
    } catch (err) {
      setError('Erro ao carregar dados');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filtros]);

  return { data, kpis, graficos, loading, error, refetch: fetchData };
};