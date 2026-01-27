// Cards e Tabela
export interface TipoInsumoQuantidadeDTO {
    tipo: string;
    quantidade: number;
}

export interface InsumoTabelaDTO {
    id: number;
    dataEntrada: string; // LocalDate
    nome: string;
    tipo: string;
    quantidade: number;
    unidadeMedida: string;
    statusInsumo: string;
    dataValidade?: string; // LocalDate
}

export interface RelatorioInsumosDTO {
    // Cards
    totalInsumos: number;
    insumosEstoqueBaixo: number;
    consumoMedioMensal: number;

    // Graficos
    insumosOk: number;
    insumosProximoVencimento: number;
    insumosPorTipo: TipoInsumoQuantidadeDTO[];

    // Tabela
    tabela: InsumoTabelaDTO[];
}
