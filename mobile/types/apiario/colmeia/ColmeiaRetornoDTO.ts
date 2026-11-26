import { StatusColmeia, TipoColmeia } from './Enums';

export interface ColmeiaRetornoDTO {
    id: number;
    identificador: string;
    caminhoDaFoto: string;
    nomeApiario: string;
    apiarioId?: number;
    ativa?: boolean;
    tipo: TipoColmeia;
    statusColmeia: StatusColmeia;
    ultimaVistoria: string; // LocalDate
    observacoes: string;
    latitude: number; // BigDecimal
    longitude: number; // BigDecimal
    detalhesDaLocalizacao: string;
}
