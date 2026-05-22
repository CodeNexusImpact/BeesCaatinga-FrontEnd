import api from './api';
import type { InsumoRetornoDTO } from '@/types/insumos';

/**
 * Filtros para busca de insumos
 */
interface FiltrosInsumo {
  nome?: string;
  tipoInsumo?: string;
  userId: string;
}

/**
 * 1. LISTAGEM: Retorna insumos via caminho relativo herdado do api.ts.
 */
export const getInsumos = async (filtros?: FiltrosInsumo): Promise<InsumoRetornoDTO[]> => {
  const params = filtros?.userId ? { produtorId: filtros.userId } : {};
  const response = await api.get<InsumoRetornoDTO[]>('/insumos', { params });
  
  let resultado = response.data || [];

  if (filtros?.nome) {
    resultado = resultado.filter(item => 
      item.nome?.toLowerCase().includes(filtros.nome!.toLowerCase())
    );
  }
  
  if (filtros?.tipoInsumo) {
    resultado = resultado.filter(item => 
      item.tipoInsumo?.toLowerCase() === filtros.tipoInsumo!.toLowerCase()
    );
  }

  return resultado;
};

/**
 * 2. BUSCA POR ID: Detalhes de um registro específico.
 */
export const getInsumoById = async (id: string): Promise<InsumoRetornoDTO> => {
  const response = await api.get<InsumoRetornoDTO>(`/insumos/${id}`);
  return response.data;
};

/**
 * 3. CADASTRO: Persistência de novo registro (Remove ID manual).
 */
export const cadastrarInsumo = async (produtorId: string, dados: any): Promise<InsumoRetornoDTO> => {
  const { id, ...payload } = dados;
  const response = await api.post<InsumoRetornoDTO>('/insumos', {
    ...payload,
    produtorId: parseInt(produtorId)
  });
  return response.data;
};

/**
 * 4. EDIÇÃO: Atualização de registro existente via PUT relativo.
 */
export const atualizarInsumo = async (id: string, dados: any): Promise<InsumoRetornoDTO> => {
  const response = await api.put<InsumoRetornoDTO>(`/insumos/${id}`, dados);
  return response.data;
};

/**
 * 5. EXCLUSÃO: Remoção física do registro via DELETE relativo.
 */
export const deletarInsumo = async (id: string | number): Promise<void> => {
  const response = await api.delete(`/insumos/${id}`);
  return response.data;
};

/**
 * 6. KPIs: Estatísticas analíticas dinâmicas usando chaves do db.json.
 */
export const getKpisInsumos = async (userId: string) => {
  const insumos = await getInsumos({ userId });
  
  if (!insumos || insumos.length === 0) {
    return { totalItens: 0, estoqueBaixo: 0, emUso: 0 };
  }

  const totalItens = insumos.length;
  const estoqueBaixo = insumos.filter(i => i.statusInsumo === 'ESTOQUE_BAIXO').length;
  const emUso = insumos.filter(i => i.statusInsumo === 'EM_USO').length;

  return { totalItens, estoqueBaixo, emUso };
};

/**
 * 7. GRÁFICOS: Processamento analítico real para o Dashboard.
 */
export const getGraficosInsumos = async (userId: string) => {
  const insumos = await getInsumos({ userId });

  if (!insumos || insumos.length === 0) {
    return { porTipo: [], porStatus: [], raw: [] };
  }

  // Agrupamento por tipoInsumo
  const tipoCount: { [key: string]: number } = {};
  insumos.forEach(i => {
    const tipo = i.tipoInsumo || 'Outros';
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
