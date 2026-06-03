import api from './api';

const BASE_URL = '/vistorias';

export const listarVistoriasPorProdutor = async (produtorId: number | string) => {
  try {
    const response = await api.get(`${BASE_URL}/${produtorId}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Erro ao buscar vistorias:', error);
    return [];
  }
};

export const listarPorColmeia = async (colmeiaId: number | string) => {
  try {
    const response = await api.get(`${BASE_URL}/colmeia/${colmeiaId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar vistorias da colmeia ${colmeiaId}:`, error);
    throw error;
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

export const cadastrarVistoria = async (produtorId: number | string, apiarioId: number | string, colmeiaId: number | string, dados: any) => {
  try {
    const response = await api.post(`${BASE_URL}/produtor/${produtorId}/apiario/${apiarioId}/colmeia/${colmeiaId}`, dados);
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar vistoria:', error);
    throw error;
  }
};

export const atualizarVistoria = async (vistoriaId: string | number, produtorId: number | string, dados: any) => {
  try {
    const response = await api.put(`${BASE_URL}/${vistoriaId}/produtor/${produtorId}`, dados);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar vistoria ${vistoriaId}:`, error);
    throw error;
  }
};

export const deletarVistoria = async (vistoriaId: string | number, produtorId: number | string) => {
  try {
    const response = await api.delete(`${BASE_URL}/${vistoriaId}/produtor/${produtorId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar vistoria ${vistoriaId}:`, error);
    throw error;
  }
};

export const getKpisVistorias = async (produtorId: string | number) => {
  try {
    const dados = await listarVistoriasPorProdutor(produtorId);
    const total = dados.length;
    const saudaveis = dados.filter((v: any) => ['saudavel', 'excelente', 'saudável'].includes(v.condicao?.toLowerCase())).length;
    const criticas = dados.filter((v: any) => ['risco', 'perdida', 'alerta'].includes(v.condicao?.toLowerCase())).length;
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
  return await listarVistoriasPorProdutor(produtorId); 
};

export const getVistorias = listarVistoriasPorProdutor;

export default {
  listarVistoriasPorProdutor,
  getVistorias,
  listarPorColmeia,
  getVistoriaById,
  cadastrarVistoria,
  atualizarVistoria,
  deletarVistoria,
  getKpisVistorias,
  getGraficosVistorias,
};
