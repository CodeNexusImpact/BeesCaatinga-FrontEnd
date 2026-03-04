import { Genero } from './Enums';

export interface ProdutorRetornoDTO {
    id: number;
    caminhoDaFoto: string;
    nomeCompleto: string;
    genero: Genero;
    email: string;
    nomeDaEmpresa: string;
    telefone: string;
    endereco: string;
}
