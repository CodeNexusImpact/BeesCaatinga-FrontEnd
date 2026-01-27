import { CondicaoVistoria, TipoPerda, TipoPraga } from './Enums';

export interface VistoriaCriadaDTO {
    dataVistoria: string;
    apiario_id: number;
    colmeia_id: number;
    condicao: CondicaoVistoria;
    pragasIdentificadas?: TipoPraga[];
    perdasIdentificadas?: TipoPerda[];
    observacoes?: string;
}
