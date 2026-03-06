import { useState, useEffect } from 'react';
import type { ProducaoRetornoDTO } from '@/types/producao';
import type { Kpi, GraficoConfig } from '@/types/common';

interface UseProducaoResult {
  data: ProducaoRetornoDTO[];
  kpis: Kpi[];
  graficos: GraficoConfig[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useProducao = (filtros: any = {}): UseProducaoResult => {
  const [data, setData] = useState<ProducaoRetornoDTO[]>([]);
  const [kpis, setKpis] = useState<Kpi[]>([]);
  const [graficos, setGraficos] = useState<GraficoConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dados simulados (fixos para todos os usuários)
  const mockData: ProducaoRetornoDTO[] = [
    { 
        id: 1, 
        tipoProducao: "Mel",
        quantidade: 100,
        statusProduto: "EM_ESTOQUE",
        dataColeta: "2025-06-20", 
        dataVenda: undefined,
        nomeApiario: "Serra do Mel", 
        nomeColmeia: "C1",
        statusQualidade: "APROVADO"
    },
    { 
        id: 2, 
        tipoProducao: "Mel",
        quantidade: 120,
        statusProduto: "EM_ESTOQUE",
        dataColeta: "2025-07-04", 
        nomeApiario: "Vale das Abelhas", 
        nomeColmeia: "C2",
        statusQualidade: "NAO_AVALIADO"
    },
    { 
        id: 3, 
        tipoProducao: "Própolis",
        quantidade: 150,
        statusProduto: "VENDIDO",
        dataColeta: "2025-08-15", 
        dataVenda: "2025-09-01",
        nomeApiario: "Rosa do Sertão", 
        nomeColmeia: "C3",
        statusQualidade: "APROVADO"
    },
    { 
        id: 4, 
        tipoProducao: "Mel",
        quantidade: 200,
        statusProduto: "EM_ESTOQUE",
        dataColeta: "2024-06-03", 
        nomeApiario: "Apiário Central", 
        nomeColmeia: "C5",
        statusQualidade: "APROVADO"
    },
  ];

  const mockKpis: Kpi[] = [
    { label: 'Produção Total', value: '570 kg' },
    { label: 'Média/Colmeia', value: '142.5 kg' },
  ];

  const mockGraficos: GraficoConfig[] = [
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
      // Integração com o backend real
      const produtorId = 1; // ID do produtor mockado para integração
      const response = await api.get<ProducaoRetornoDTO[]>(`/producoes/${produtorId}`);
      let fetchedData = response.data;

      // Aplica filtros
      if (filtros.ano) {
        fetchedData = fetchedData.filter(item => item.dataColeta.includes(filtros.ano));
      }
      if (filtros.mes) {
        const mesPreenchido = filtros.mes.padStart(2, '0');
        fetchedData = fetchedData.filter(item => item.dataColeta.includes(`-${mesPreenchido}-`));
      }
      if (filtros.apiario) {
        fetchedData = fetchedData.filter(item => item.nomeApiario === filtros.apiario);
      }

      setData(fetchedData);
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