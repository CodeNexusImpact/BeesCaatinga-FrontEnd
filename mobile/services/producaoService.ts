import type { ProducaoRetornoDTO } from '@/types/producao';

interface FiltrosProducao {
  ano?: string;
  mes?: string;
  apiario?: string;
  userId: string;
}

// ✅ Dados simulados atualizados para ProducaoRetornoDTO
const mockProducao: ProducaoRetornoDTO[] = [
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

export const getProducao = async (filtros: FiltrosProducao): Promise<ProducaoRetornoDTO[]> => {
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 300));

  // Aplica filtros simples
  let resultado = [...mockProducao];

  if (filtros.ano) {
    resultado = resultado.filter(item => item.dataColeta.includes(filtros.ano as string));
  }
  if (filtros.mes) {
    // Filtro simplificado para string YYYY-MM-DD
    const mesPreenchido = filtros.mes.padStart(2, '0');
    resultado = resultado.filter(item => item.dataColeta.includes(`-${mesPreenchido}-`));
  }
  if (filtros.apiario) {
    resultado = resultado.filter(item => item.nomeApiario === filtros.apiario);
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