import { Genero } from './Enums';

export interface ProdutorCriadoDTO {
    nomeCompleto: string;
    telefone: string;
    email: string;
    dataDeNascimento: string; // LocalDate
    genero: Genero;
    senha?: string;
}
