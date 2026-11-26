export const EVENTOS_WEBHOOK = [
  { value: 'apiario.criado', label: 'Apiário criado' },
  { value: 'colmeia.criada', label: 'Colmeia criada' },
  { value: 'vistoria.criada', label: 'Vistoria criada' },
  { value: 'producao.criada', label: 'Produção criada' },
  { value: 'lote.criado', label: 'Lote criado' },
  { value: 'insumo.criado', label: 'Insumo criado' },
] as const;

export type EventoWebhook = (typeof EVENTOS_WEBHOOK)[number]['value'];

export interface WebhookDTO {
  id: number;
  url: string;
  eventos: EventoWebhook[];
  ativo: boolean;
  /** Retornado apenas na criação. */
  segredo?: string | null;
}

export interface WebhookCriadoDTO {
  url: string;
  eventos: EventoWebhook[];
}

export interface WebhookAtualizadoDTO {
  url?: string;
  eventos?: EventoWebhook[];
  ativo?: boolean;
}

export interface WebhookEntregaDTO {
  id: number;
  evento: string;
  statusHttp: number | null;
  sucesso: boolean;
  tentativa: number;
  erro: string | null;
  criadoEm: string;
}
