import { StatusColmeia } from '../apiario/colmeia/Enums';
import { TipoPerda, TipoPraga } from '../vistorias/Enums';
import { StatusColmeiasDTO } from './producao';

// Cards e Tabela
export interface VistoriaMensalDTO {
    mes: number;
    quantidade: number;
}

export interface VistoriaTabelaDTO {
    dataVistoria: string; // LocalDate
    observacoes?: string;
    situacao: StatusColmeia;
    pragasIdentificadas?: TipoPraga[];
    perdasIdentificadas?: TipoPerda[];
}

export interface RelatorioVistoriaDTO {
    vistoriasTotais: number;
    colmeiasSaudaveis: number;
    colmeiasEmAtencao: number;

    statusColmeias: StatusColmeiasDTO[]; // Reutilizado de Producao
    vistoriasMensais: VistoriaMensalDTO[];
    tabela: VistoriaTabelaDTO[];
}
