import { ColmeiaItemProps } from './Colmeias';

// 1. Tipo Simplificado para Listas
export interface ApiarioListProps {
    id: number;
    nome: string;
    colmeiasAtivas: number;
    colmeiasTotal: number;
    colmeias: ColmeiaItemProps[];
}


// 2. Tipo Completo para Telas de Detalhes/Edição
export interface ApiarioCompletoProps extends ApiarioListProps {
    // Herda os campos simples e adiciona os detalhes:
    //foto: string[]; // URLs ou caminhos das fotos
    registro: string;
    dataCriacao: string;
    observacoes: string;
    localizacao: {
        cep: string;
        propriedade: string;
        estado: string;
        cidade: string;
        bairro: string;
        rua: string;
        numero: string;
        complemento: string;
        latitude: number;
        longitude: number;
    };
}

// 3. Tipo para Criação (O que o Front-end ENVIA)
// Note que NÃO inclui 'id'
export interface ApiarioCriacaoDTO {
    nome: string;
    registro: string;
    dataCriacao: string;

    localizacao: {
        cep: string;
        propriedade: string;
        estado: string;
        cidade: string;
        bairro: string;
        rua: string;
        numero: string;
        complemento: string;
        latitude: number;
        longitude: number;
    };
    colmeiasAtivas: number;
    colmeiasTotal: number;
    colmeias: {
        madeira: {
            ativa: number;
            inativa: number;
        };
        concreto: {
            ativa: number;
            inativa: number;
        }
        poliestireno: {
            ativa: number;
            inativa: number;
        };        
    }
    //foto: string[]; // URLs ou caminhos das fotos
    observacoes: string;
}

export interface ApiarioUpdateDTO extends ApiarioCriacaoDTO {
    // Mesmos campos do DTO de criação, mas pode incluir o 'id' para identificar qual apiário atualizar
    id: number;
}