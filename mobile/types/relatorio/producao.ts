// Cards e Tabela
export interface ProducaoMensalDTO {
    mes: string;
    pesoKg: number;
}

export interface StatusColmeiasDTO {
    status: string;
    quantidade: number;
}

export interface LoteMelDTO {
    id: number;
    dataExtracao: string; // LocalDate
    pesoKg: number;
}

export interface RelatorioProducaoDTO {
    // Cards
    producaoTotalKg: number;
    produtividadeMediaPorColmeia: number;
    produtividadeMediaPorApiario: number;
    numeroDeVistorias: number;

    // Gráficos
    producaoMensal: ProducaoMensalDTO[];
    statusColmeias: StatusColmeiasDTO[];

    // Tabela
    lotesMel: LoteMelDTO[];
}
