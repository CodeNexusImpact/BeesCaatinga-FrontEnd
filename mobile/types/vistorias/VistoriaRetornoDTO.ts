import { CondicaoVistoria, TipoPerda, TipoPraga } from './Enums';

export interface VistoriaRetornoDTO {
    dataVistoria: string; // LocalDate
    condicao: CondicaoVistoria;
    nomeColmeia: string;
    nomeApiario: string;
    pragasIdentificadas: TipoPraga[];
    perdasIdentificadas: TipoPerda[];
    observacoes: string;
}
