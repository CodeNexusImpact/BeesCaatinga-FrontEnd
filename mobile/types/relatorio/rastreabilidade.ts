import { TipoAbelha, TipoFlorada } from '../rastreabilidade/Enums';

// Cards e Tabela
export interface LotesPorTipoAbelhaDTO {
    tipoAbelha: string;
    quantidade: number;
}

export interface LotesPorFloradaDTO {
    florada: string;
    quantidade: number;
}

export interface VendidosNaoVendidosDTO {
    vendidos: number;
    naoVendidos: number;
}

export interface LoteTabelaDTO {
    id: number;
    dataProducao: string; // LocalDate
    quantidadeProduzida: number;
    tipoFlorada: TipoFlorada;
    nomeDaPropriedade: string;
    tipoAbelha: TipoAbelha;
}

export interface RelatorioRastreabilidadeDTO {
    // Cards
    totalLotes: number;
    pesoTotalRastreavel: number;
    porcentagemVendidos: number;
    tempoMedioDias: number;

    // Gráficos
    graficoTipoAbelha: LotesPorTipoAbelhaDTO[];
    graficoVendidos: VendidosNaoVendidosDTO;
    graficoFlorada: LotesPorFloradaDTO[];

    // Tabela
    tabela: LoteTabelaDTO[];
}
