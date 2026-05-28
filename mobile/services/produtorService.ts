import api from './api';
import { Produtor, ProdutorCriado } from '@/types/user'; // Assuming these types will be created

export const cadastrarProdutor = async (produtor: ProdutorCriado): Promise<Produtor> => {
  try {
    const response = await api.post<Produtor>('/produtores', produtor);
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar produtor:', error);
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

export default {
  cadastrarProdutor,
  atualizarProdutor,
};
