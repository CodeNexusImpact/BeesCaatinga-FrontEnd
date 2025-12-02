-- Tabela de Insumos
CREATE TABLE insumos (
    id BIGSERIAL PRIMARY KEY,
    data_entrada DATE ,
    nome VARCHAR(255) ,
    tipo VARCHAR(255),
    quantidade DOUBLE PRECISION,
    unidade_medida VARCHAR(255),
    data_validade DATE ,
    observacoes VARCHAR(255),
    status_insumo VARCHAR(255),
    produtor_id BIGINT,
    FOREIGN KEY (produtor_id) REFERENCES produtores(id)
);

CREATE INDEX idx_insumos_produtor ON insumos(produtor_id);