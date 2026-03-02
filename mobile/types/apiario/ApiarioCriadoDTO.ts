export interface ApiarioCriadoDTO {
    nome: string;
    nRegistro: string;
    dataDeCriacao?: string; // Sem @NotNull no backend -> Opcional
    cep: string;
    nomeDaPropriedade: string;
    estado: string;
    cidade: string;
    bairro: string;
    rua: string;
    numero?: string;
    complemento?: string;
    produtor_id: number; // Mapeado exatamente como no backend (snake_case)
    latitude: number;
    longitude: number;
}