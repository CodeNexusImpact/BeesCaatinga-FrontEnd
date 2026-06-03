-- Inserir Produtor de Teste
INSERT INTO produtores (email, senha, nome_completo, nome_da_empresa, telefone, genero, data_de_nascimento, endereco)
VALUES ('dev@produtor.com', 'dev123', 'Produtor de Teste', 'Fazenda Caatinga Dev', '87999999999', 'MASCULINO', '1990-01-01', 'Zona Rural, Sertão');

-- Inserir Apiário associado (Buscando o ID gerado para o e-mail acima)
INSERT INTO apiarios (nome, n_registro, data_de_criacao, nome_da_propriedade, cidade, estado, produtor_id)
SELECT 'Apiário Central', 'REG123456', CURRENT_DATE, 'Propriedade Modelo', 'Petrolina', 'PE', id 
FROM produtores WHERE email = 'dev@produtor.com';

-- Inserir Colmeia associada
INSERT INTO colmeias (identificador, apiario_id, tipo, ativa, situacao)
SELECT 'COL-001', id, 'Langsroth', true, 'PRODUZINDO'
FROM apiarios WHERE n_registro = 'REG123456';
