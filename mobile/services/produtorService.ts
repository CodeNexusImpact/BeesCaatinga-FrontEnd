import api from './api';
import { Produtor, ProdutorCriado } from '@/types/user'; 

export const cadastrarProdutor = async (produtor: ProdutorCriado): Promise<Produtor> => {
  try {
    const response = await api.post<Produtor>('/produtores', produtor);
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar produtor:', error);
    throw error;
  }
};

export const buscarProdutor = async (id: number | string): Promise<Produtor> => {
  try {
    const response = await api.get<Produtor>(`/produtores/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar produtor ${id}:`, error);
    throw error;
  }
};

export const atualizarProdutor = async (id: number | string, produtor: any): Promise<Produtor> => {
  try {
    const response = await api.put<Produtor>(`/produtores/${id}`, produtor);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar produtor:', error);
    throw error;
  }
};

export const deletarProdutor = async (id: number | string): Promise<void> => {
  try {
    await api.delete(`/produtores/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar produtor ${id}:`, error);
    throw error;
  }
};

export default {
  cadastrarProdutor,
  buscarProdutor,
  atualizarProdutor,
  deletarProdutor,
};
