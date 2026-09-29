export interface LocalizacaoMapa {
  id: number | string;
  latitude: number;
  longitude: number;
  nome: string;
  descricao?: string;
  tipo: 'apiario' | 'propriedade' | 'produtor' | 'vistoria';
}

export interface RegiaoDeMapa {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface MarkerPersonalizado {
  localizacao: LocalizacaoMapa;
  corPin?: string;
  icone?: string;
}