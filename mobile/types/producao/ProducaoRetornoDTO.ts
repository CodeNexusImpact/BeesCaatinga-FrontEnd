import { StatusProduto, StatusQualidade } from './Enums';

export interface ProducaoRetornoDTO {
    id: number;
    tipoProducao: string;
    quantidade: number;
    statusProduto: StatusProduto;
    dataColeta: string; // LocalDate
    dataVenda?: string; // LocalDate
    nomeApiario: string;
    nomeColmeia: string;
    statusQualidade: StatusQualidade;
}
