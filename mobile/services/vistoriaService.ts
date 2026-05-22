import api from './api';

const VISTORIAS_ENDPOINT = '/vistorias';

export interface Vistoria {
  id?: number;
  data: string;
  colmeiaId: number | string;
  apiarioId: number | string;
  condicaoVistoria: string;
  observacoes: string;
  produtorId?: number;
}

/**
 * 1. LISTAGEM: Retorna vistorias filtradas por produtor
 */
export const getVistorias = async (produtorId: string | number): Promise<Vistoria[]> => {
  try {
    const response = await api.get<Vistoria[]>(VISTORIAS_ENDPOINT, {
      params: { produtorId }
    });
    return response.data || [];
  } catch (error) {
    console.error('Erro ao buscar vistorias:', error);
    throw error;
  }
};

/**
 * 2. BUSCA POR ID
 */
export const getVistoriaById = async (id: string | number): Promise<Vistoria> => {
  try {
    const response = await api.get<Vistoria>(`${VISTORIAS_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar vistoria ${id}:`, error);
    throw error;
  }
};

/**
 * 3. CADASTRO: Remove ID manual para o json-server gerar
 */
export const cadastrarVistoria = async (produtorId: string | number, dados: any): Promise<Vistoria> => {
  try {
    const { id, ...payload } = dados;
    const response = await api.post<Vistoria>(VISTORIAS_ENDPOINT, {
      ...payload,
      produtorId: Number(produtorId)
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar vistoria:', error);
    throw error;
  }
};

/**
 * 4. EDIÇÃO: Atualização via PUT
 */
export const atualizarVistoria = async (id: string | number, dados: any): Promise<Vistoria> => {
  try {
    const response = await api.put<Vistoria>(`${VISTORIAS_ENDPOINT}/${id}`, dados);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar vistoria ${id}:`, error);
    throw error;
  }
};

/**
 * 5. EXCLUSÃO
 */
export const deletarVistoria = async (id: string | number): Promise<void> => {
  try {
    await api.delete(`${VISTORIAS_ENDPOINT}/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar vistoria ${id}:`, error);
    throw error;
  }
};

/**
 * 6. KPIs: Estatísticas analíticas dinâmicas
 */
export const getKpisVistorias = async (produtorId: string | number) => {
  try {
    const vistorias = await getVistorias(produtorId);

    if (!vistorias || vistorias.length === 0) {
      return [
        { label: 'Vistorias Realizadas', value: '0' },
        { label: 'Colmeias Saudáveis', value: '0' },
        { label: 'Situação Crítica', value: '0' },
        { label: 'Saúde Geral (%)', value: '0%' },
      ];
    }

    const total = vistorias.length;
    const saudaveis = vistorias.filter(v => ['saudavel', 'excelente'].includes(v.condicaoVistoria?.toLowerCase())).length;
    const criticas = vistorias.filter(v => ['risco', 'perdida'].includes(v.condicaoVistoria?.toLowerCase())).length;
    const taxaSaude = total > 0 ? ((saudaveis / total) * 100).toFixed(0) : '0';

    return [
      { label: 'Vistorias Realizadas', value: total.toString() },
      { label: 'Colmeias Saudáveis', value: saudaveis.toString() },
      { label: 'Situação Crítica', value: criticas.toString() },
      { label: 'Saúde Geral (%)', value: `${taxaSaude}%` },
    ];
  } catch (error) {
    console.error('Erro ao buscar KPIs de vistorias:', error);
    throw error;
  }
};

/**
 * 7. GRÁFICOS: Processamento analítico real para o Dashboard
 */
export const getGraficosVistorias = async (produtorId: string | number) => {
  try {
    const vistorias = await getVistorias(produtorId);

    if (!vistorias || vistorias.length === 0) {
      return {
        pizzaData: [],
        lineData: { labels: ['Sem dados'], datasets: [{ data: [0] }] }
      };
    }

    // Agrupamento por condição para o gráfico de pizza
    const statusCount: { [key: string]: number } = {};
    vistorias.forEach(v => {
      const condicao = v.condicaoVistoria?.toLowerCase() || 'outros';
      statusCount[condicao] = (statusCount[condicao] || 0) + 1;
    });

    const coresCondicao: { [key: string]: string } = {
      'saudavel': '#2ecc71',
      'excelente': '#2ecc71',
      'manutencao': '#f1c40f',
      'risco': '#e67e22',
      'perdida': '#e74c3c',
    };

    const labelsCondicao: { [key: string]: string } = {
      'saudavel': 'Saudável',
      'excelente': 'Excelente',
      'manutencao': 'Manutenção',
      'risco': 'Em Risco',
      'perdida': 'Perdida',
    };

    const pizzaData = Object.entries(statusCount).map(([status, population]) => ({
      name: labelsCondicao[status] || status,
      population,
      color: coresCondicao[status] || '#95a5a6',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }));

    // Dados para o gráfico de linha (evolução mensal)
    const lineDataMap: { [key: string]: number } = {};
    vistorias.forEach(v => {
      try {
        const dateParts = v.data.includes('/') ? v.data.split('/') : v.data.split('-');
        // Formato esperado: DD/MM/YYYY ou YYYY-MM-DD
        const month = v.data.includes('/') ? dateParts[1] : dateParts[1];
        const year = v.data.includes('/') ? dateParts[2] : dateParts[0];
        if (month && year) {
          const key = `${month}/${year.toString().slice(-2)}`;
          lineDataMap[key] = (lineDataMap[key] || 0) + 1;
        }
      } catch (e) {
        console.warn('Erro ao processar data da vistoria:', v.data);
      }
    });

    const lineLabels = Object.keys(lineDataMap).sort().slice(-6);
    const lineValues = lineLabels.map(label => lineDataMap[label]);

    return {
      pizzaData,
      lineData: {
        labels: lineLabels.length > 0 ? lineLabels : ['Sem dados'],
        datasets: [{ data: lineValues.length > 0 ? lineValues : [0] }]
      }
    };
  } catch (error) {
    console.error('Erro ao buscar gráficos de vistorias:', error);
    throw error;
  }
};