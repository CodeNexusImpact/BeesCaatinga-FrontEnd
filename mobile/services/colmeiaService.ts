import api from './api';

export const listarColmeiasPorApiario = async (produtorId: number | string, apiarioId: number | string) => {
  try {
    const response = await api.get(`/colmeias/produtor/${produtorId}/apiario/${apiarioId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar colmeias por apiário:', error);
    throw error;
  }
};

export const listarAtivas = async (produtorId: number | string, apiarioId: number | string) => {
  try {
    const response = await api.get(`/colmeias/produtor/${produtorId}/apiario/${apiarioId}/ativas`);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar colmeias ativas:', error);
    throw error;
  }
};

export const listarInativas = async (produtorId: number | string, apiarioId: number | string) => {
  try {
    const response = await api.get(`/colmeias/produtor/${produtorId}/apiario/${apiarioId}/inativas`);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar colmeias inativas:', error);
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

export const cadastrarColmeia = async (produtorId: number | string, apiarioId: number | string, dados: any) => {
  try {
    const response = await api.post(`/colmeias/produtor/${produtorId}/apiario/${apiarioId}`, dados);
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar colmeia:', error);
    throw error;
  }
};

export const atualizarColmeia = async (produtorId: number | string, apiarioId: number | string, colmeiaId: number | string, dados: any) => {
  try {
    const response = await api.put(`/colmeias/produtor/${produtorId}/apiario/${apiarioId}/colmeia/${colmeiaId}`, dados);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar colmeia ${colmeiaId}:`, error);
    throw error;
  }
};

export const deletarColmeia = async (produtorId: number | string, apiarioId: number | string, colmeiaId: number | string) => {
  try {
    await api.delete(`/colmeias/produtor/${produtorId}/apiario/${apiarioId}/colmeia/${colmeiaId}`);
  } catch (error) {
    console.error(`Erro ao deletar colmeia ${colmeiaId}:`, error);
    throw error;
  }
};

export const listarColmeiasPorProdutor = async (produtorId: number | string) => {
  try {
    const response = await api.get(`/colmeias/produtor/${produtorId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao listar colmeias do produtor ${produtorId}:`, error);
    throw error;
  }
};

export default {
  listarColmeiasPorApiario,
  listarColmeiasPorProdutor,
  listarAtivas,
  listarInativas,
  buscarColmeiaPorId,
  cadastrarColmeia,
  atualizarColmeia,
  deletarColmeia,
};
