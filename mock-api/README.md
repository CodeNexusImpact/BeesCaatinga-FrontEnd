# BeesCaatinga Mock API

Esta é uma API mock para o projeto BeesCaatinga, utilizando `json-server`. Ela simula as rotas do backend para facilitar o desenvolvimento do frontend (mobile).

## Como rodar

1. Certifique-se de ter o Node.js instalado.
2. Navegue até esta pasta:
   ```bash
   cd mock-api
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor:
   ```bash
   npm start
   ```
O servidor estará rodando em `http://localhost:3000`.

## Usuário de Teste

- **Email:** `joao@example.com`
- **Senha:** `123`

## Rotas Mapeadas

- `POST /login`: Retorna o perfil do produtor se as credenciais estiverem corretas.
- `GET /apiarios/:produtorId`: Lista os apiários de um produtor.
- `GET /colmeias/produtor/:produtorId/apiario/:apiarioId`: Lista todas as colmeias de um apiário.
- `GET /colmeias/produtor/:produtorId/apiario/:apiarioId/ativas`: Lista apenas as colmeias ativas.
- `GET /colmeias/produtor/:produtorId/apiario/:apiarioId/inativas`: Lista apenas as colmeias inativas.
- `GET /produtores/:id`: Busca detalhes de um produtor.
- `GET /insumos/:produtorId`: Lista insumos de um produtor.
- `GET /producoes/:produtorId`: Lista produções de um produtor.

As rotas de `POST`, `PUT` e `DELETE` padrão do `json-server` também funcionam para os recursos base (`/produtores`, `/apiarios`, `/colmeias`, `/insumos`, `/producoes`, `/vistorias`).
