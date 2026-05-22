import api from './api';
import type { InsumoRetornoDTO, InsumoCriadoDTO, InsumoAtualizadoDTO } from '@/types/insumos';

interface FiltrosInsumo {
  nome?: string;
  tipo?: string;
  userId: string;
}

/**
 * Retorna a listagem de insumos com base no ID do produtor e filtros opcionais.
 */
export const getInsumos = async (filtros: FiltrosInsumo): Promise<InsumoRetornoDTO[]> => {
  try {
    // Busca os insumos forçando a porta 8081 conforme solicitado
    const response = await api.get<InsumoRetornoDTO[]>('http://localhost:8081/insumos', {
      params: { produtorId: filtros.userId }
    });

    let resultado = response.data;

    if (filtros.nome) {
      resultado = resultado.filter(item => 
        item.nome.toLowerCase().includes(filtros.nome!.toLowerCase())
      );
    }
    
    if (filtros.tipo) {
      resultado = resultado.filter(item => 
        item.tipo?.toLowerCase() === filtros.tipo!.toLowerCase()
      );
    }

    return resultado;
  } catch (error) {
    console.error('Erro ao buscar insumos:', error);
    throw error;
  }
};

/**
 * Busca um insumo específico pelo seu ID.
 */
export const getInsumoPorId = async (id: string): Promise<InsumoRetornoDTO> => {
  try {
    const response = await api.get<InsumoRetornoDTO>(`http://localhost:8081/insumos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar insumo ${id}:`, error);
    throw error;
  }
};

/**
 * Cadastra um novo insumo.
 */
export const cadastrarInsumo = async (produtorId: string, dto: InsumoCriadoDTO): Promise<InsumoRetornoDTO> => {
  try {
    const response = await api.post<InsumoRetornoDTO>('http://localhost:8081/insumos', {
      ...dto,
      produtorId: parseInt(produtorId),
      statusInsumo: 'DISPONIVEL'
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar insumo:', error);
    throw error;
  }
};

/**
 * Atualiza os dados de um insumo existente.
 */
export const atualizarInsumo = async (id: string, dto: InsumoAtualizadoDTO): Promise<InsumoRetornoDTO> => {
  try {
    const response = await api.put<InsumoRetornoDTO>(`http://localhost:8081/insumos/${id}`, dto);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar insumo ${id}:`, error);
    throw error;
  }
};

/**
 * Remove um insumo da base de dados.
 */
export const deletarInsumo = async (id: number): Promise<void> => {
  try {
    await api.delete(`http://localhost:8081/insumos/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar insumo ${id}:`, error);
    throw error;
  }
};

/**
 * Retorna KPIs básicos de insumos para o produtor.
 */
export const getKpisInsumos = async (userId: string): Promise<{ total: number; baixa: number }> => {
  try {
    const insumos = await getInsumos({ userId });
    
    const total = insumos.length;
    const baixa = insumos.filter(i => i.statusInsumo === 'ESTOQUE_BAIXO').length;

    return {
      total,
      baixa,
    };
  } catch (error) {
    console.error('Erro ao buscar KPIs de insumos:', error);
    throw error;
  }
};

/**
 * Processa dados para exibição de gráficos de insumos.
 */
export const getGraficosInsumos = async (userId: string): Promise<any[]> => {
  try {
    const insumos = await getInsumos({ userId });

    // Agrupamento por Tipo
    const tipoCount: { [key: string]: number } = {};
    insumos.forEach(i => {
      const tipo = i.tipo || 'Outros';
      tipoCount[tipo] = (tipoCount[tipo] || 0) + 1;
    });

    const dadosBarra = Object.entries(tipoCount).map(([tipo, quantidade]) => ({
      tipo,
      quantidade
    }));

    // Agrupamento por Status
    const statusCount: { [key: string]: number } = {};
    insumos.forEach(i => {
      statusCount[i.statusInsumo] = (statusCount[i.statusInsumo] || 0) + 1;
    });

    const coresStatus: { [key: string]: string } = {
      'DISPONIVEL': '#2ecc71',
      'EM_USO': '#3498db',
      'ESTOQUE_BAIXO': '#e74c3c',
    };

    const dadosPizza = Object.entries(statusCount).map(([status, quantidade]) => ({
      status: status.replace('_', ' '),
      quantidade,
      cor: coresStatus[status] || '#95a5a6'
    }));

    return [
      {
        tipo: 'barra',
        titulo: 'Insumos por Categoria',
        dados: dadosBarra,
      },
      {
        tipo: 'pizza',
        titulo: 'Status de Estoque',
        dados: dadosPizza,
      },
    ];
  } catch (error) {
    console.error('Erro ao buscar gráficos de insumos:', error);
    throw error;
  }
};
