import { UnidadeMedida } from './Enums';

export interface InsumoCriadoDTO {
    dataEntrada: string; // @NotNull
    nome: string; // @NotBlank
    tipo?: string; // Sem anotação
    quantidade?: number; // Sem anotação @NotNull no backend
    unidadeMedida?: UnidadeMedida; // Sem anotação @NotNull no backend
    dataValidade?: string; 
    observacoes?: string;
}