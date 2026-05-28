import { StatusInsumo, UnidadeMedida } from './Enums';

export interface InsumoRetornoDTO {
    dataValidade: string;
    id: number;
    dataEntrada: string; // LocalDate
    nome: string;
    tipo: string;
    quantidade: number;
    unidadeMedida: UnidadeMedida;
    statusInsumo: StatusInsumo;
    observacoes: string;
}
