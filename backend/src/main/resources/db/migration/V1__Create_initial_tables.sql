-- Tabela de Produtores
CREATE TABLE produtores (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255),
    senha VARCHAR(255),
    nome_completo VARCHAR(255),
    nome_da_empresa VARCHAR(255),
    telefone VARCHAR(255),
    genero VARCHAR(255),
    data_de_nascimento DATE,
    endereco VARCHAR(255),
    caminho_da_foto VARCHAR(255)
);

-- Tabela de Apiários
CREATE TABLE apiarios (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255),
    n_registro VARCHAR(255) UNIQUE,
    data_de_criacao DATE,
    caminho_da_foto VARCHAR(255),
    cep VARCHAR(255),
    nome_da_propriedade VARCHAR(255),
    estado VARCHAR(255),
    cidade VARCHAR(255),
    bairro VARCHAR(255),
    rua VARCHAR(255),
    numero VARCHAR(255),
    complemento VARCHAR(255),
    observacoes VARCHAR(255),
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    produtor_id BIGINT,
    FOREIGN KEY (produtor_id) REFERENCES produtores(id)
);

-- Tabela de Colmeias
CREATE TABLE colmeias (
    id BIGSERIAL PRIMARY KEY,
    identificador VARCHAR(255) UNIQUE,
    apiario_id BIGINT,
    tipo VARCHAR(255),
    ativa BOOLEAN,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    observacoes VARCHAR(255),
    situacao VARCHAR(255),
    ultima_vistoria DATE,
    detalhes_da_localizacao VARCHAR(255),
    caminho_da_foto VARCHAR(255),
    FOREIGN KEY (apiario_id) REFERENCES apiarios(id)
);

-- Índices para performance
CREATE INDEX idx_apiarios_produtor ON apiarios(produtor_id);
CREATE INDEX idx_colmeias_apiario ON colmeias(apiario_id);