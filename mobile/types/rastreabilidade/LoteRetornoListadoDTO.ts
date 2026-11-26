import { TipoAbelha, TipoFlorada } from './Enums';

export interface LoteRetornoListadoDTO {
    id: number;
    dataProducao: string; // LocalDate
    quantidadeProduzida: number;
    nomeApiario: string;
    tipoFlorada?: TipoFlorada | null;
    tipoAbelha?: TipoAbelha | null;
    vendido?: boolean | null;
    latitude?: number | null;
    longitude?: number | null;
    apiarioId?: number | null;
    colmeiaId?: number | null;
    identificadorColmeia?: string | null;
}
