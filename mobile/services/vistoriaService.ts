import api from './api';

const BASE_URL = '/vistorias';

export const getVistorias = async (produtorId: number | string) => {
  try {
    const response = await api.get(BASE_URL, {
      params: { produtorId: Number(produtorId) }
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Erro ao buscar vistorias:', error);
    return [];
  }
};

export const getVistoriaById = async (id: string | number) => {
  try {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar vistoria ${id}:`, error);
    throw error;
  }
};

export const cadastrarVistoria = async (dados: any) => {
  try {
    const { id, ...payload } = dados; // Remove ID para auto-incremento do db.json
    const response = await api.post(BASE_URL, payload);
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar vistoria:', error);
    throw error;
  }
};

export const atualizarVistoria = async (id: string | number, dados: any) => {
  try {
    const response = await api.put(`${BASE_URL}/${id}`, dados);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar vistoria ${id}:`, error);
    throw error;
  }
};

export const deletarVistoria = async (id: string | number, produtorId?: number | string) => {
  try {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar vistoria ${id}:`, error);
    throw error;
  }
};

export const getKpisVistorias = async (produtorId: string | number) => {
  try {
    const dados = await getVistorias(produtorId);
    const total = dados.length;
    const saudaveis = dados.filter((v: any) => ['saudavel', 'excelente'].includes(v.condicaoVistoria?.toLowerCase())).length;
    const criticas = dados.filter((v: any) => ['risco', 'perdida', 'alerta'].includes(v.condicaoVistoria?.toLowerCase())).length;
    const taxa = total > 0 ? ((saudaveis / total) * 100).toFixed(0) : '0';

    return [
      { label: 'Vistorias Realizadas', value: total.toString() },
      { label: 'Colmeias Saudáveis', value: saudaveis.toString() },
      { label: 'Situação Crítica', value: criticas.toString() },
      { label: 'Saúde Geral (%)', value: `${taxa}%` },
    ];
  } catch (error) {
    console.error('Erro ao calcular KPIs de vistorias:', error);
    return [];
  }
};

export const getGraficosVistorias = async (produtorId: string | number) => {
  return await getVistorias(produtorId); 
};
