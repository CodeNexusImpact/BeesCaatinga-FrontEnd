export interface ApiarioAtualizadoDTO {
    nome?: string;
    nRegistro?: string;
    dataDeCriacao?: string; // dd/MM/yyyy
    cep?: string;
    nomeDaPropriedade?: string;
    estado?: string;
    cidade?: string;
    bairro?: string;
    rua?: string;
    numero?: string;
    complemento?: string;
    observacoes?: string;
    caminhoDaFoto?: string;
    latitude?: number;
    longitude?: number;
}
