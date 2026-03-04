import { StatusColmeia, TipoColmeia } from './Enums';

export interface ColmeiaRetornoDTO {
    identificador: string;
    caminhoDaFoto: string;
    nomeApiario: string;
    tipo: TipoColmeia;
    statusColmeia: StatusColmeia;
    ultimaVistoria: string; // LocalDate
    observacoes: string;
    latitude: number; // BigDecimal
    longitude: number; // BigDecimal
    detalhesDaLocalizacao: string;
}
