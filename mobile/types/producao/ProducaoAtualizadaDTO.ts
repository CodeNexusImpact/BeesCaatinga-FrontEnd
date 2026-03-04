import { UnidadeMedida } from '../insumos/Enums';

export interface ProducaoAtualizadaDTO {
    tipoProducao?: string;
    quantidade?: number;
    unidadeMedida?: UnidadeMedida;
    apiarioId?: number;
    colmeiaId?: number;
    dataColeta?: string;
}
