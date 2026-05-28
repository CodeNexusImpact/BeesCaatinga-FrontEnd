import { StatusInsumo, UnidadeMedida } from './Enums';

export interface InsumoRetornoDTO {
    id: number;
    produtorId: number;
    dataInsumo: string; 
    nome: string;
    tipoInsumo: string;
    quantidade: number;
    unidadeMedida: UnidadeMedida;
    dataValidade: string;
    statusInsumo: StatusInsumo;
    observacoes: string;
}
