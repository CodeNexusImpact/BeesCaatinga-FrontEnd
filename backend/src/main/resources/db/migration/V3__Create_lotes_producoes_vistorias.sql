-- Tabela de Lotes
CREATE TABLE lotes (
    id BIGSERIAL PRIMARY KEY,
    data_producao DATE,
    quantidade_produzida DOUBLE PRECISION,
    apiario_id BIGINT,
    tipo_florada VARCHAR(255),
    tipo_abelha VARCHAR(255),
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    FOREIGN KEY (apiario_id) REFERENCES apiarios(id)
);

-- Tabela de Produções
CREATE TABLE producoes (
    id BIGSERIAL PRIMARY KEY,
    tipo_producao VARCHAR(255),
    quantidade DOUBLE PRECISION,
    unidade_medida VARCHAR(255),
    litros DOUBLE PRECISION,
    apiario_id BIGINT,
    colmeia_id BIGINT,
    data_coleta DATE,
    data_venda DATE,
    status_produto VARCHAR(255),
    status_qualidade VARCHAR(255),
    FOREIGN KEY (apiario_id) REFERENCES apiarios(id),
    FOREIGN KEY (colmeia_id) REFERENCES colmeias(id)
);

-- Tabela de Vistorias
CREATE TABLE vistorias (
    id BIGSERIAL PRIMARY KEY,
    data_vistoria DATE,
    apiario_id BIGINT,
    colmeia_id BIGINT,
    condicao VARCHAR(255),
    outras_pragas VARCHAR(255),
    observacoes varchar(255),
    caminho_da_foto VARCHAR(255),
    data_criacao DATE,
    FOREIGN KEY (apiario_id) REFERENCES apiarios(id),
    FOREIGN KEY (colmeia_id) REFERENCES colmeias(id)
);

-- TABELA ASSOCIATIVA: VISTORIA_PRAGAS (Many-to-Many)
CREATE TABLE vistoria_pragas (
    vistoria_id BIGINT,
    praga VARCHAR(255),
    PRIMARY KEY (vistoria_id, praga),
    FOREIGN KEY (vistoria_id) REFERENCES vistorias(id)
);

-- TABELA ASSOCIATIVA: VISTORIA_PERDAS (Many-to-Many)
CREATE TABLE vistoria_perdas (
    vistoria_id BIGINT,
    perda VARCHAR(255),
    PRIMARY KEY (vistoria_id, perda),
    FOREIGN KEY (vistoria_id) REFERENCES vistorias(id)
);



-- ÍNDICES PARA PERFORMANCE
-- Lotes
CREATE INDEX idx_lotes_apiario ON lotes(apiario_id);
CREATE INDEX idx_lotes_data_producao ON lotes(data_producao);
CREATE INDEX idx_lotes_tipo_florada ON lotes(tipo_florada);

-- Produções
CREATE INDEX idx_producoes_apiario ON producoes(apiario_id);
CREATE INDEX idx_producoes_colmeia ON producoes(colmeia_id);
CREATE INDEX idx_producoes_data_coleta ON producoes(data_coleta);
CREATE INDEX idx_producoes_status ON producoes(status_produto, status_qualidade);
CREATE INDEX idx_producoes_tipo ON producoes(tipo_producao);

-- Vistorias
CREATE INDEX idx_vistorias_apiario ON vistorias(apiario_id);
CREATE INDEX idx_vistorias_colmeia ON vistorias(colmeia_id);
CREATE INDEX idx_vistorias_data ON vistorias(data_vistoria);
CREATE INDEX idx_vistorias_condicao ON vistorias(condicao);

-- Vistoria Pragas/Perdas
CREATE INDEX idx_vistoria_pragas_vistoria ON vistoria_pragas(vistoria_id);
CREATE INDEX idx_vistoria_perdas_vistoria ON vistoria_perdas(vistoria_id);



-- CONSTRAINTS DE VALIDAÇÃO
-- Garantir que data_venda seja posterior ou igual a data_coleta
ALTER TABLE producoes
ADD CONSTRAINT chk_producoes_datas
CHECK (data_venda IS NULL OR data_venda >= data_coleta);

-- Garantir que quantidade seja positiva
ALTER TABLE producoes
ADD CONSTRAINT chk_producoes_quantidade
CHECK (quantidade >= 0);

ALTER TABLE lotes
ADD CONSTRAINT chk_lotes_quantidade
CHECK (quantidade_produzida >= 0);

-- Garantir datas válidas
ALTER TABLE vistorias
ADD CONSTRAINT chk_vistorias_data
CHECK (data_vistoria <= CURRENT_DATE);

ALTER TABLE producoes
ADD CONSTRAINT chk_producoes_data_coleta
CHECK (data_coleta <= CURRENT_DATE);



-- COMENTÁRIOS DAS TABELAS (Documentação)
COMMENT ON TABLE lotes IS 'Lotes de produção apícola agrupados por apiário e característica';
COMMENT ON TABLE producoes IS 'Registros individuais de produção por colmeia';
COMMENT ON TABLE vistorias IS 'Registros de vistorias técnicas nas colmeias';
COMMENT ON TABLE vistoria_pragas IS 'Relação many-to-many de pragas identificadas em vistorias';
COMMENT ON TABLE vistoria_perdas IS 'Relação many-to-many de perdas identificadas em vistorias';