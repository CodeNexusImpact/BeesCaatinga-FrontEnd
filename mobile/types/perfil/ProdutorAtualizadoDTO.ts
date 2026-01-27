import { Genero } from './Enums';

export interface ProdutorAtualizadoDTO {
    caminhoDaFoto?: string;
    nomeCompleto?: string;
    genero?: Genero;
    nomeDaEmpresa?: string;
    telefone?: string;
    endereco?: string;
}
