export type Genero = 'FEMININO' | 'MASCULINO' | 'OUTRO';

export interface Produtor {
  id: number;
  nomeCompleto: string;
  telefone: string;
  email: string;
  dataDeNascimento: string; // Assuming string in "dd/MM/yyyy" format
  genero: Genero;
}

export interface ProdutorCriado extends Omit<Produtor, 'id'> {
  senha?: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  role: 'admin' | 'produtor' | 'vistoriador';
}