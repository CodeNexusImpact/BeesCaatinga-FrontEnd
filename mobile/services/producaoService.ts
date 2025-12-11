import type { Producao } from '@/types/producao';

interface FiltrosProducao {
  ano?: string;
  mes?: string;
  apiario?: string;
  userId: string;
}

// ✅ Dados simulados
const mockProducao: Producao[] = [
  { loteId: 'ID-01', dataExtracao: '20/06/2025', pesoLitro: '1.3', apiario: 'Serra do Mel', colmeia: 'C1', producaoTotal: '100' },
  { loteId: 'ID-02', dataExtracao: '04/07/2025', pesoLitro: '1.7', apiario: 'Vale das Abelhas', colmeia: 'C2', producaoTotal: '120' },
  { loteId: 'ID-03', dataExtracao: '15/08/2025', pesoLitro: '2.0', apiario: 'Rosa do Sertão', colmeia: 'C3', producaoTotal: '150' },
  { loteId: 'ID-04', dataExtracao: '03/06/2024', pesoLitro: '4.6', apiario: 'Apiário Central', colmeia: 'C5', producaoTotal: '200' },
];

export const getProducao = async (filtros: FiltrosProducao): Promise<Producao[]> => {
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 300));

  // Aplica filtros simples (ano, mês, apiário)
  let resultado = [...mockProducao];

  if (filtros.ano) {
    resultado = resultado.filter(item => item.dataExtracao.includes(filtros.ano as string));
  }
  if (filtros.mes) {
    const mesPreenchido = filtros.mes.padStart(2, '0');
    resultado = resultado.filter(item => item.dataExtracao.includes(`/${mesPreenchido}/`));
  }
  if (filtros.apiario) {
    resultado = resultado.filter(item => item.apiario === filtros.apiario);
  }

  return resultado;
};

export const getKpisProducao = async (userId: string): Promise<{ total: number; media: number }> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return {
    total: 570,
    media: 142.5,
  };
};

export const getGraficosProducao = async (userId: string): Promise<any[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return [
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
        { status: 'Atenção', quantidade: 0, cor: '#f1c40f' },
        { status: 'Crítica', quantidade: 0, cor: '#e74c3c' },
      ],
    },
  ];
};