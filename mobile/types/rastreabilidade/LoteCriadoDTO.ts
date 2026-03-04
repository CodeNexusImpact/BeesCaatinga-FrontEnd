import { TipoAbelha, TipoFlorada } from './Enums';

export interface LoteCriadoDTO {
    dataProducao: string; // LocalDate
    quantidadeProduzida: number;
    nomeApiario: string;
    tipoFlorada?: TipoFlorada;
    latitude: number;
    longitude: number;
    tipoAbelha: TipoAbelha;
    vendido?: boolean;
}
