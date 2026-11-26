import { StatusInsumo, UnidadeMedida } from './Enums';

// Espelha io.sage.BeesCaatinga.controller.dto.insumo.InsumoRetornoDTO (datas ISO yyyy-MM-dd).
export interface InsumoRetornoDTO {
    id: number;
    dataEntrada: string;
    nome: string;
    tipo: string;
    quantidade: number;
    unidadeMedida: UnidadeMedida;
    statusInsumo: StatusInsumo;
    dataValidade?: string | null;
    observacoes: string;
}
