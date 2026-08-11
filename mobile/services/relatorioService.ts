import api from './api';

export const gerarRelatorioProducao = async (filtro: any) => {
  try {
    const response = await api.post('/relatorios/producao', filtro);
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar relatório de produção:', error);
    throw error;
  }
};

export const gerarRelatorioVistoria = async (filtro: any) => {
  try {
    const response = await api.post('/relatorios/vistorias', filtro);
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar relatório de vistorias:', error);
    throw error;
  }
};

export const gerarRelatorioRastreabilidade = async (filtro: any) => {
  try {
    const response = await api.post('/relatorios/rastreabilidade', filtro);
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar relatório de rastreabilidade:', error);
    throw error;
  }
};

export default {
  gerarRelatorioProducao,
  gerarRelatorioVistoria,
  gerarRelatorioRastreabilidade,
};
