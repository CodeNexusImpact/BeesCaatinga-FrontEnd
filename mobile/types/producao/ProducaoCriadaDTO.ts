import { UnidadeMedida } from '../insumos/Enums';

export interface ProducaoCriadaDTO {
    tipoProducao: string; // @NotBlank
    quantidade: number; // @NotNull
    unidadeMedida: UnidadeMedida; // @NotNull
    apiarioId: number; // @NotNull
    colmeiaId: number; // @NotNull
    dataColeta: string; // @NotNull
}