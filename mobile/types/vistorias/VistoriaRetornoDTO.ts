import { CondicaoVistoria, TipoPerda, TipoPraga } from './Enums';

export interface VistoriaRetornoDTO {
    id?: number;
    dataVistoria: string; // LocalDate
    condicao: CondicaoVistoria;
    nomeColmeia: string;
    nomeApiario: string;
    apiarioId?: number;
    colmeiaId?: number;
    pragasIdentificadas: TipoPraga[];
    perdasIdentificadas: TipoPerda[];
    observacoes: string;
}
