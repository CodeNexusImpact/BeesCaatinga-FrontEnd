import { ColmeiaRetornoEmApiarioDTO } from './colmeia/ColmeiaRetornoEmApiarioDTO';

export interface ApiarioRetornoDTO {
    id: any;
    nome: string;
    caminhoDaFoto: string; // Pode vir nulo, mas Java String mapeia pra string | null
    nRegistro: string;
    dataDeCriacao: string; // LocalDate yyyy-MM-dd
    observacoes: string;
    cep: string;
    nomeDaPropriedade: string;
    estado: string;
    cidade: string;
    bairro: string;
    rua: string;
    numero: string;
    complemento: string;
    colmeias: ColmeiaRetornoEmApiarioDTO[];
}
