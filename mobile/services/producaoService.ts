import api from './api';
import type { ProducaoRetornoDTO, ProducaoCriadaDTO } from '@/types/producao';

interface FiltrosProducao {
  ano?: string;
  mes?: string;
  apiario?: string;
  userId: string;
}

export const cadastrarProducao = async (produtorId: string, dto: ProducaoCriadaDTO): Promise<ProducaoRetornoDTO> => {
  try {
    // Simulação de nomes para o mock-api (JSON Server não faz join sozinho no POST)
    const nomeApiario = dto.apiarioId === 1 ? 'Rosa do Sertão' : 'Vale das Abelhas';
    const nomeColmeia = `Colmeia ${dto.colmeiaId}`;

    const response = await api.post<ProducaoRetornoDTO>(`/producoes`, {
      ...dto,
      produtorId: parseInt(produtorId),
      nomeApiario,
      nomeColmeia,
      statusProduto: 'EM_ESTOQUE',
      statusQualidade: 'NAO_AVALIADO'
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar produção:', error);
    throw error;
  }
};

export const deletarProducao = async (producaoId: number): Promise<void> => {
  try {
    await api.delete(`/producoes/${producaoId}`);
  } catch (error) {
    console.error('Erro ao deletar produção:', error);
    throw error;
  }
};

export const getProducaoPorId = async (id: string): Promise<ProducaoRetornoDTO> => {
  try {
    const response = await api.get<ProducaoRetornoDTO>(`/producoes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar produção ${id}:`, error);
    throw error;
  }
};

export const atualizarProducao = async (id: string, dto: any): Promise<ProducaoRetornoDTO> => {
  try {
    // Simulação de nomes para o mock-api
    const nomeApiario = dto.apiarioId === 1 ? 'Rosa do Sertão' : 'Vale das Abelhas';
    const nomeColmeia = `Colmeia ${dto.colmeiaId}`;

    const response = await api.put<ProducaoRetornoDTO>(`/producoes/${id}`, {
      ...dto,
      nomeApiario,
      nomeColmeia
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar produção ${id}:`, error);
    throw error;
  }
};

export const getProducao = async (filtros: FiltrosProducao): Promise<ProducaoRetornoDTO[]> => {
  try {
    // Busca as produções filtrando pelo produtorId (mapeado de userId)
    const response = await api.get<ProducaoRetornoDTO[]>('/producoes', {
      params: { produtorId: filtros.userId }
    });

    let resultado = response.data;

    // Aplica filtros adicionais localmente conforme solicitado
    if (filtros.ano) {
      resultado = resultado.filter(item => item.dataColeta.includes(filtros.ano as string));
    }
    if (filtros.mes) {
      const mesPreenchido = filtros.mes.padStart(2, '0');
      resultado = resultado.filter(item => item.dataColeta.includes(`-${mesPreenchido}-`));
    }
    if (filtros.apiario) {
      resultado = resultado.filter(item => item.nomeApiario === filtros.apiario);
    }

    return resultado;
  } catch (error) {
    console.error('Erro ao buscar produções:', error);
    throw error;
  }
};

export const getKpisProducao = async (userId: string): Promise<{ total: number; media: number }> => {
  try {
    const producoes = await getProducao({ userId });

    const total = producoes.reduce((acc, curr) => acc + curr.quantidade, 0);
    const media = producoes.length > 0 ? total / producoes.length : 0;

    return {
      total,
      media,
    };
  } catch (error) {
    console.error('Erro ao buscar KPIs de produção:', error);
    throw error;
  }
};

export const getGraficosProducao = async (userId: string): Promise<any[]> => {
  try {
    const producoes = await getProducao({ userId });

    // Processamento para o gráfico de linhas: Agrupamento por Mês/Ano
    const producaoPorMes: { [key: string]: number } = {};

    producoes.forEach(p => {
      const data = new Date(p.dataColeta + 'T00:00:00');
      const mesAbreviado = data.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
      const mesFormatado = mesAbreviado.charAt(0).toUpperCase() + mesAbreviado.slice(1);
      const anoAbreviado = data.getFullYear().toString().slice(-2);
      const chave = `${mesFormatado}/${anoAbreviado}`;

      producaoPorMes[chave] = (producaoPorMes[chave] || 0) + p.quantidade;
    });

    const dadosLinha = Object.entries(producaoPorMes).map(([mes, producao]) => ({
      mes,
      producao
    }));

    // Processamento para o gráfico de barras: Agrupamento por Status de Qualidade
    const statusCount: { [key: string]: number } = {};
    producoes.forEach(p => {
      statusCount[p.statusQualidade] = (statusCount[p.statusQualidade] || 0) + 1;
    });

    const coresStatus: { [key: string]: string } = {
      'APROVADO': '#2ecc71',
      'NAO_AVALIADO': '#95a5a6',
    };

    const dadosBarra = Object.entries(statusCount).map(([status, quantidade]) => ({
      status: status.replace('_', ' '),
      quantidade,
      cor: coresStatus[status] || '#bdc3c7'
    }));

    return [
      {
        tipo: 'linha',
        titulo: 'Produção Mensal (kg)',
        dados: dadosLinha,
      },
      {
        tipo: 'barra',
        titulo: 'Status de Qualidade',
        dados: dadosBarra,
      },
    ];
  } catch (error) {
    console.error('Erro ao buscar gráficos de produção:', error);
    throw error;
  }
};