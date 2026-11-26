import api from './api';
import type { LocalizacaoMapa } from '@/types/mapa/mapaLocalizacao';
import { listarApiariosPorProdutor } from './apiarioService';
import { listarColmeiasPorProdutor } from './colmeiaService';
import { listarVistoriasPorProdutor } from './vistoriaService';
import type { ApiarioRetornoDTO } from '@/types/apiario';

type Tipo = LocalizacaoMapa['tipo'];

const temCoordenada = (lat: unknown, lng: unknown) =>
  lat !== null && lat !== undefined && lng !== null && lng !== undefined && Number.isFinite(Number(lat)) && Number.isFinite(Number(lng));

/** Normaliza o retorno dos endpoints /localizacoes (campos numéricos podem vir como BigDecimal/string). */
const normalizar = (lista: any[], tipo: Tipo): LocalizacaoMapa[] =>
  (Array.isArray(lista) ? lista : [])
    .filter((l) => temCoordenada(l?.latitude, l?.longitude))
    .map((l, i) => ({
      id: l.id ?? `${tipo}-${i}`,
      latitude: Number(l.latitude),
      longitude: Number(l.longitude),
      nome: l.nome ?? l.identificador ?? l.nomeDaPropriedade ?? (tipo === 'vistoria' ? `Vistoria ${l.id ?? ''}` : 'Sem nome'),
      descricao: l.descricao ?? undefined,
      tipo,
    }));

/** Tenta o endpoint dedicado; se não existir no backend (404/405), usa o cálculo local. */
async function comFallback(url: string, tipo: Tipo, local: () => Promise<LocalizacaoMapa[]>) {
  try {
    const { data } = await api.get(url);
    return normalizar(data, tipo);
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 404 || status === 405 || status === 501) return local();
    throw error;
  }
}

const apiariosParaMapa = (apiarios: ApiarioRetornoDTO[]): LocalizacaoMapa[] =>
  apiarios
    .filter((a) => temCoordenada(a.latitude, a.longitude))
    .map((a) => ({
      id: a.id,
      latitude: Number(a.latitude),
      longitude: Number(a.longitude),
      nome: a.nome,
      descricao: [a.nomeDaPropriedade, [a.cidade, a.estado].filter(Boolean).join(' - ')].filter(Boolean).join(' · '),
      tipo: 'apiario' as const,
    }));

export const buscarLocalizacoesApiarios = (produtorId: number | string) =>
  comFallback(`/apiarios/localizacoes/${produtorId}`, 'apiario', async () => apiariosParaMapa(await listarApiariosPorProdutor(produtorId)));

export const buscarLocalizacoesVistorias = (produtorId: number | string) =>
  comFallback(`/vistorias/localizacoes/${produtorId}`, 'vistoria', async () => {
    const [vistorias, colmeias, apiarios] = await Promise.all([
      listarVistoriasPorProdutor(produtorId),
      listarColmeiasPorProdutor(produtorId),
      listarApiariosPorProdutor(produtorId),
    ]);
    return (vistorias as any[])
      .map((v) => {
        const c = (colmeias as any[]).find((x) => x.id === v.colmeiaId);
        const a = apiarios.find((x) => x.id === v.apiarioId);
        const lat = temCoordenada(c?.latitude, c?.longitude) ? c.latitude : a?.latitude;
        const lng = temCoordenada(c?.latitude, c?.longitude) ? c.longitude : a?.longitude;
        if (!temCoordenada(lat, lng)) return null;
        const data = String(v.dataVistoria ?? '').split('-').reverse().join('/');
        return {
          id: v.id,
          latitude: Number(lat),
          longitude: Number(lng),
          nome: `Vistoria ${data} · ${v.nomeColmeia ?? ''}`.trim(),
          descricao: v.nomeApiario,
          tipo: 'vistoria' as const,
        };
      })
      .filter(Boolean) as LocalizacaoMapa[];
  });

export const buscarLocalizacoesPropriedades = (produtorId: number | string) =>
  comFallback(`/propriedades/localizacoes/${produtorId}`, 'propriedade', async () => {
    const apiarios = (await listarApiariosPorProdutor(produtorId)).filter((a) => a.nomeDaPropriedade && temCoordenada(a.latitude, a.longitude));
    const grupos = new Map<string, ApiarioRetornoDTO[]>();
    apiarios.forEach((a) => grupos.set(a.nomeDaPropriedade, [...(grupos.get(a.nomeDaPropriedade) ?? []), a]));
    return [...grupos.entries()].map(([nome, lista], i) => ({
      id: `propriedade-${i}`,
      latitude: lista.reduce((s, a) => s + Number(a.latitude), 0) / lista.length,
      longitude: lista.reduce((s, a) => s + Number(a.longitude), 0) / lista.length,
      nome,
      descricao: `${lista.length} apiário(s)`,
      tipo: 'propriedade' as const,
    }));
  });

/**
 * PUT /apiarios/{id}/localizacao {latitude, longitude}.
 * Se o endpoint dedicado não existir, atualiza pelo PUT completo do apiário (preservando os demais campos).
 */
export const atualizarLocalizacaoApiario = async (
  apiarioId: number | string,
  latitude: number,
  longitude: number,
  produtorId?: number | string,
): Promise<void> => {
  try {
    await api.put(`/apiarios/${apiarioId}/localizacao`, { latitude, longitude });
  } catch (error: any) {
    const status = error?.response?.status;
    if (!produtorId || !(status === 404 || status === 405)) throw error;
    const apiario = (await listarApiariosPorProdutor(produtorId)).find((a) => String(a.id) === String(apiarioId));
    if (!apiario) throw error;
    const { id: _id, colmeias: _c, ...campos } = apiario as any;
    const data = campos.dataDeCriacao ? String(campos.dataDeCriacao).split('-').reverse().join('/') : null;
    await api.put(`/apiarios/${apiarioId}/produtor/${produtorId}`, { ...campos, dataDeCriacao: data, latitude, longitude });
  }
};
