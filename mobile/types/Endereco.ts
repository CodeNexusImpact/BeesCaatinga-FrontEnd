import { CoordenadasProps } from '@/types/Coordenadas';

export interface EnderecoProps {
    cep: string;
    propriedade: string;
    estado: string;
    cidade: string;
    bairro: string;
    rua: string;
    numero: string;
    complemento: string;
    coordenadas: CoordenadasProps;
}