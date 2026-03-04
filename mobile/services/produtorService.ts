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

export const listarProdutores = async (): Promise<Produtor[]> => {
  try {
    const response = await api.get<Produtor[]>('/produtores');
    return response.data;
  } catch (error) {
    console.error('Erro ao listar produtores:', error);
    throw error;
  }
};
