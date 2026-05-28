import api from './api';

export const listarColmeiasPorApiario = async (apiarioId: number | string) => {
  try {
    const response = await api.get(`/colmeias/apiario/${apiarioId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar colmeias por apiário:', error);
    throw error;
  }
};

export const buscarColmeiaPorId = async (id: number | string) => {
  try {
    const response = await api.get(`/colmeias/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar colmeia ${id}:`, error);
    throw error;
  }
};

export const cadastrarColmeia = async (dados: any) => {
  try {
    const response = await api.post('/colmeias', dados);
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar colmeia:', error);
    throw error;
  }
};

export const atualizarColmeia = async (id: number | string, dados: any) => {
  try {
    const response = await api.put(`/colmeias/${id}`, dados);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar colmeia ${id}:`, error);
    throw error;
  }
};

export const deletarColmeia = async (id: number | string) => {
  try {
    await api.delete(`/colmeias/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar colmeia ${id}:`, error);
    throw error;
  }
};

export default {
  listarColmeiasPorApiario,
  buscarColmeiaPorId,
  cadastrarColmeia,
  atualizarColmeia,
  deletarColmeia,
};
