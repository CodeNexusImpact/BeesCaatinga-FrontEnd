import api from './api';
import type { InsumoRetornoDTO } from '@/types/insumos';

export const getInsumos = async (produtorId: number | string): Promise<InsumoRetornoDTO[]> => {
  try {
    const response = await api.get<InsumoRetornoDTO[]>('/insumos', {
      params: { produtorId: Number(produtorId) }
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Erro ao listar insumos:', error);
    return [];
  }
};

export const getInsumoById = async (insumoId: number | string): Promise<any | null> => {
  try {
    const response = await api.get<any>(`/insumos/${insumoId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar insumo ${insumoId}:`, error);
    throw error;
  }
};

export const cadastrarInsumo = async (produtorId: number | string, dados: any): Promise<any> => {
  try {
    const { id, ...payloadLimpo } = dados;
    payloadLimpo.produtorId = Number(produtorId);
    
    const response = await api.post<any>('/insumos', payloadLimpo);
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar insumo:', error);
    throw error;
  }
};

export const atualizarInsumo = async (insumoId: number | string, dados: any): Promise<any> => {
  try {
    const { id, ...payloadLimpo } = dados;
    const response = await api.put<any>(`/insumos/${insumoId}`, payloadLimpo);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar insumo ${insumoId}:`, error);
    throw error;
  }
};

export const deletarInsumo = async (insumoId: number | string): Promise<void> => {
  try {
    await api.delete(`/insumos/${insumoId}`);
  } catch (error) {
    console.error(`Erro ao deletar insumo ${insumoId}:`, error);
    throw error;
  }
};

/**
 * 6. KPIs: Estatísticas analíticas dinâmicas
 */
export const getKpisInsumos = async (produtorId: string | number) => {
  const insumos = await getInsumos(produtorId);
  
  if (!insumos || insumos.length === 0) {
    return { totalItens: 0, estoqueBaixo: 0, emUso: 0 };
  }

  const totalItens = insumos.length;
  const estoqueBaixo = insumos.filter(i => i.statusInsumo === 'ESTOQUE_BAIXO').length;
  const emUso = insumos.filter(i => i.statusInsumo === 'EM_USO').length;

  return { totalItens, estoqueBaixo, emUso };
};

/**
 * 7. GRÁFICOS: Processamento analítico real para o Dashboard
 */
export const getGraficosInsumos = async (produtorId: string | number) => {
  const insumos = await getInsumos(produtorId);

  if (!insumos || insumos.length === 0) {
    return { porTipo: [], porStatus: [], raw: [] };
  }

  // Agrupamento por tipoInsumo
  const tipoCount: { [key: string]: number } = {};
  insumos.forEach(i => {
    const tipo = i.tipo || 'Outros';
    tipoCount[tipo] = (tipoCount[tipo] || 0) + 1;
  });

  const dadosPorTipo = Object.entries(tipoCount).map(([name, value]) => ({ name, value }));

  // Agrupamento por statusInsumo
  const statusCount: { [key: string]: number } = {};
  insumos.forEach(i => {
    const status = i.statusInsumo || 'DISPONIVEL';
    statusCount[status] = (statusCount[status] || 0) + 1;
  });

  const coresStatus: { [key: string]: string } = {
    'DISPONIVEL': '#4CAF50',
    'EM_USO': '#2196F3',
    'ESTOQUE_BAIXO': '#F44336',
  };

  const dadosPorStatus = Object.entries(statusCount).map(([status, value]) => ({
    name: status.replace('_', ' '),
    value,
    color: coresStatus[status] || '#9E9E9E'
  }));

  return {
    porTipo: dadosPorTipo,
    porStatus: dadosPorStatus,
    raw: insumos
  };
};
