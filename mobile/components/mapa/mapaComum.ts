import type { RegiaoDeMapa } from '@/types/mapa/mapaLocalizacao';

/** Região inicial padrão (sertão nordestino) quando não há pontos cadastrados. */
export const REGIAO_PADRAO: RegiaoDeMapa = { latitude: -7.0247, longitude: -37.2806, latitudeDelta: 0.5, longitudeDelta: 0.5 };

export const COR_TIPO: Record<string, string> = {
  apiario: '#2E7D32',
  vistoria: '#1565C0',
  propriedade: '#F57C00',
  produtor: '#C62828',
};

/** Valida faixas de latitude (-90 a 90) e longitude (-180 a 180). Retorna mensagem de erro ou null. */
export function validarCoordenadas(latitude: unknown, longitude: unknown): string | null {
  const lat = Number(latitude);
  const lng = Number(longitude);
  if (latitude === '' || latitude == null || !Number.isFinite(lat)) return 'Latitude inválida.';
  if (longitude === '' || longitude == null || !Number.isFinite(lng)) return 'Longitude inválida.';
  if (lat < -90 || lat > 90) return 'A latitude deve estar entre -90 e 90.';
  if (lng < -180 || lng > 180) return 'A longitude deve estar entre -180 e 180.';
  return null;
}

/** Arredonda para 6 casas (precisão de ~10 cm, compatível com o BigDecimal do backend). */
export const arredondarCoordenada = (n: number) => Math.round(n * 1e6) / 1e6;
