import { TipoColmeia } from './Enums';

export interface ColmeiaCriadaDTO {
    identificador: string;
    apiario_id: number;
    tipo: TipoColmeia;
    ativa: boolean;
    observacoes?: string;
    detalhesDaLocalizacao?: string;
    caminhoDaFoto?: string;
    latitude: number;
    longitude: number;
}
