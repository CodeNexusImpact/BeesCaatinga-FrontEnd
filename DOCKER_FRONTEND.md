# Guia de Execução do Frontend com Docker

Este guia descreve como realizar o build e executar o container do frontend da aplicação BeesCaatinga.

## Pré-requisitos

*   Docker instalado
*   Docker Compose instalado (ou plugin `docker compose` integrado ao Docker)

## Passo a Passo para Execução

### 1. Preparação
Certifique-se de estar na raiz do projeto (onde se encontra o arquivo `docker-compose.yml`).

### 2. Build e Execução
Para subir todo o ambiente (Banco, Backend e Frontend), execute:

```bash
docker compose up --build
```

Caso deseje subir **apenas o frontend** (e o backend/db separadamente), você pode usar:

```bash
docker compose up frontend --build
```

### 3. Acesso à Aplicação
Após o container iniciar com sucesso, a versão web do frontend estará disponível em:

*   **URL:** [http://localhost](http://localhost) (Porta 80)

### 4. Funcionamento Técnico
*   O Dockerfile do frontend utiliza uma imagem **Node** para realizar o build (exportação do Expo para web).
*   Os arquivos estáticos gerados são então servidos por um servidor **Nginx** de alto desempenho dentro do container.
*   O frontend está configurado para se comunicar com o backend na porta `8080`.

## Comandos Úteis

*   **Parar os containers:** `docker compose down`
*   **Verificar logs:** `docker compose logs -f frontend`
*   **Reiniciar apenas o front:** `docker compose restart frontend`

## Solução de Problemas
Se o frontend não conseguir se comunicar com o backend:
1. Verifique se o container `beescaatinga_backend` está rodando (`docker ps`).
2. Verifique se a porta `8080` do backend está acessível.
3. Certifique-se de que não há outro processo ocupando a porta `80` na sua máquina local.
