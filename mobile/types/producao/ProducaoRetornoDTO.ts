import { StatusProduto, StatusQualidade } from './Enums';

export interface ProducaoRetornoDTO {
    id: number;
    tipoProducao: string;
    quantidade: number;
    unidadeMedida?: 'KILOGRAMA' | 'LITRO' | string;
    litros?: number;
    statusProduto: StatusProduto;
    dataColeta: string; // LocalDate
    dataVenda?: string; // LocalDate
    nomeApiario: string;
    nomeColmeia: string;
    apiarioId?: number;
    colmeiaId?: number;
    statusQualidade: StatusQualidade;
}
