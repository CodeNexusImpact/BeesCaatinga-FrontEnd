import api from './api';
import { LocalizacaoMapa } from '@/types/mapa/mapaLocalizacao';

/**
 * Busca todas as localizações de apiários de um produtor
 * @param produtorId - ID do produtor
 * @returns Array de localizações com coordenadas
 */
export const buscarLocalizacoesApiarios = async (produtorId: number | string): Promise<LocalizacaoMapa[]> => {
  try {
    const response = await api.get<LocalizacaoMapa[]>(`/apiarios/localizacoes/${produtorId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar localizações de apiários:', error);
    throw error;
  }
};

/**
 * Busca todas as localizações de vistorias de um produtor
 * @param produtorId - ID do produtor
 * @returns Array de localizações com coordenadas
 */
export const buscarLocalizacoesVistorias = async (produtorId: number | string): Promise<LocalizacaoMapa[]> => {
  try {
    const response = await api.get<LocalizacaoMapa[]>(`/vistorias/localizacoes/${produtorId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar localizações de vistorias:', error);
    throw error;
  }
};

/**
 * Busca todas as propriedades com suas coordenadas
 * @param produtorId - ID do produtor
 * @returns Array de localizações de propriedades
 */
export const buscarLocalizacoesPropriedades = async (produtorId: number | string): Promise<LocalizacaoMapa[]> => {
  try {
    const response = await api.get<LocalizacaoMapa[]>(`/propriedades/localizacoes/${produtorId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar localizações de propriedades:', error);
    throw error;
  }
};

/**
 * Atualiza a localização de um apiário
 * @param apiarioId - ID do apiário
 * @param latitude - Latitude
 * @param longitude - Longitude
 */
export const atualizarLocalizacaoApiario = async (
  apiarioId: number | string,
  latitude: number,
  longitude: number
): Promise<void> => {
  try {
    await api.put(`/apiarios/${apiarioId}/localizacao`, {
      latitude,
      longitude,
    });
  } catch (error) {
    console.error('Erro ao atualizar localização do apiário:', error);
    throw error;
  }
};
