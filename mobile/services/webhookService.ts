import api from './api';
import type { WebhookAtualizadoDTO, WebhookCriadoDTO, WebhookDTO, WebhookEntregaDTO } from '@/types/webhook';

// Endpoints escopados pelo token JWT (sem produtorId no caminho).
export const listarWebhooks = async (): Promise<WebhookDTO[]> => {
  const { data } = await api.get<WebhookDTO[]>('/webhooks');
  return Array.isArray(data) ? data : [];
};

export const criarWebhook = async (dados: WebhookCriadoDTO): Promise<WebhookDTO> => (await api.post<WebhookDTO>('/webhooks', dados)).data;

export const atualizarWebhook = async (id: number, dados: WebhookAtualizadoDTO): Promise<WebhookDTO> =>
  (await api.put<WebhookDTO>(`/webhooks/${id}`, dados)).data;

export const excluirWebhook = async (id: number): Promise<void> => {
  await api.delete(`/webhooks/${id}`);
};

export const testarWebhook = async (id: number) => (await api.post(`/webhooks/${id}/teste`)).data;

export const listarEntregas = async (id: number): Promise<WebhookEntregaDTO[]> => {
  const { data } = await api.get<WebhookEntregaDTO[]>(`/webhooks/${id}/entregas`);
  return Array.isArray(data) ? data : [];
};

/** URL válida para webhook: http(s) com host. */
export const urlWebhookValida = (url: string) => /^https?:\/\/[^\s/$.?#][^\s]*$/i.test(url.trim());
