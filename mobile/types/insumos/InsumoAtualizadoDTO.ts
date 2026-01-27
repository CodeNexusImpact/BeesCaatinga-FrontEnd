import { StatusInsumo, UnidadeMedida } from './Enums';

export interface InsumoAtualizadoDTO {
    dataEntrada: string;
    nome: string;
    tipo?: string;
    quantidade: number;
    unidadeMedida: UnidadeMedida;
    statusInsumo?: StatusInsumo;
    dataValidade?: string;
    observacoes?: string;
}
