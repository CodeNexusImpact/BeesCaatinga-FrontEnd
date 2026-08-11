## Documentação do Processo de CI/CD para o Backend BeesCaatinga

Este documento detalha o fluxo de Integração Contínua e Entrega Contínua (CI/CD) configurado para o backend do projeto BeesCaatinga utilizando o GitHub Actions. O objetivo é automatizar a execução de testes e a construção e publicação da imagem Docker da aplicação, garantindo que novas versões sejam geradas apenas após a validação bem-sucedida dos testes.

---

### 1. Visão Geral do Fluxo de Trabalho (`.github/workflows/ci-cd.yml`)

Foi configurado um único arquivo de workflow, `ci-cd.yml`, localizado no diretório `.github/workflows/`. Este arquivo orquestra as duas principais fases do nosso pipeline: a validação através de testes e a construção e publicação da imagem Docker.

**Gatilhos (Triggers):**
O workflow é acionado automaticamente nas seguintes situações:
*   **`push` para o branch `backend/erick`**: Qualquer commit enviado para este branch.
*   **`pull_request` para o branch `backend/erick`**: Qualquer Pull Request aberto ou atualizado que tenha como destino este branch.

Esta configuração garante que todas as alterações propostas e integradas neste branch passem pelo processo de CI/CD.

---

### 2. Jobs do Workflow

O `ci-cd.yml` define dois jobs sequenciais: `tests` e `build-and-push-image`.

#### 2.1. Job: `tests` (Executar Testes do Backend)

**Propósito:** Este job é responsável por realizar a Integração Contínua, compilando o código e executando todos os testes unitários e de integração do projeto.

**Detalhes da Execução:**
*   **Ambiente:** Executa em um ambiente `ubuntu-latest`.
*   **Diretório de Trabalho:** Todos os comandos são executados dentro do subdiretório `backend/` do repositório.
*   **Passos:**
    1.  **`Checkout do repositório`**: Clona o código do repositório.
    2.  **`Configurar JDK 21`**: Configura o ambiente Java com o JDK 21 (Temurin) e habilita o cache de dependências do Maven para builds mais rápidos.
    3.  **`Iniciar serviços de teste (PostgreSQL)`**: Utiliza o `docker compose up -d db` para iniciar apenas o serviço de banco de dados PostgreSQL definido no `docker-compose.yml` do backend.
    4.  **`Aguardar o PostgreSQL`**: Garante que o banco de dados esteja totalmente inicializado e pronto para aceitar conexões antes de prosseguir com os testes, evitando falhas de conexão.
    5.  **`Rodar os testes com Maven`**: Executa o comando `mvn test`, que compila o projeto e executa todos os testes definidos.

**Resultado:** Se algum teste falhar, este job falha e interrompe o pipeline, impedindo que a imagem Docker seja construída.

#### 2.2. Job: `build-and-push-image` (Buildar e Enviar Imagem Docker)

**Propósito:** Este job é responsável por realizar a Entrega Contínua, construindo o artefato executável do backend, criando a imagem Docker da aplicação e publicando-a em um repositório Docker (ex: Docker Hub).

**Condição de Execução:**
*   **`needs: tests`**: Este job **só será executado se o job `tests` for concluído com sucesso.** Isso garante que apenas código testado e funcional seja transformado em uma imagem Docker.

**Detalhes da Execução:**
*   **Ambiente:** Executa em um ambiente `ubuntu-latest`.
*   **Diretório de Trabalho:** Todos os comandos são executados dentro do subdiretório `backend/` do repositório.
*   **Passos:**
    1.  **`Checkout do repositório`**: Clona o código do repositório.
    2.  **`Configurar JDK 21`**: Configura o ambiente Java com o JDK 21 (Temurin) e habilita o cache de dependências do Maven.
    3.  **`Login no Docker Hub`**: Autentica no Docker Hub usando os segredos `DOCKER_USERNAME` e `DOCKER_TOKEN` configurados no GitHub.
    4.  **`Buildar projeto Maven (sem testes, pois já rodaram)`**: Compila o projeto Maven com `mvn clean install -DskipTests`. A flag `-DskipTests` é crucial aqui para evitar a execução redundante dos testes, que já foram validados no job anterior.
    5.  **`Buildar e enviar imagem Docker`**: Utiliza a ação `docker/build-push-action@v5` para:
        *   Construir a imagem Docker a partir do `Dockerfile` localizado no diretório `backend/`.
        *   **`build-args: SKIP_TESTS=true`**: Este argumento é passado para o `Dockerfile` para sobrescrever a variável `SKIP_TESTS` definida lá. Isso garante que a etapa de `mvn clean package` dentro do `Dockerfile` também pule a execução dos testes, resolvendo o problema de falha no build da imagem reportado anteriormente.
        *   Publicar a imagem no Docker Hub, taggeando-a com `latest` e com o `SHA` do commit (`${{ github.sha }}`) para rastreabilidade. (Lembre-se de substituir `SEU_USUARIO_DOCKER` pelo seu nome de usuário real no Docker Hub).

---

### 3. Configuração de Segredos do GitHub

Para que o job `build-and-push-image` possa se autenticar e publicar imagens no Docker Hub, é necessário configurar os seguintes segredos no seu repositório GitHub (em `Settings > Secrets and variables > Actions`):

*   **`DOCKER_USERNAME`**: Seu nome de usuário do Docker Hub.
*   **`DOCKER_TOKEN`**: Um Personal Access Token do Docker Hub com permissões de escrita (Write) para repositórios.

---

### 4. Impacto no `Dockerfile`

A correção do problema de build exigiu que o `Dockerfile` fosse compatível com o argumento `SKIP_TESTS`. A linha `RUN mvn -B -DskipTests=${SKIP_TESTS} clean package` no `Dockerfile` agora utiliza essa variável para controlar a execução dos testes internamente. O workflow do GitHub Actions (`ci-cd.yml`) garante que `SKIP_TESTS=true` seja passado durante a construção da imagem, assegurando que os testes não sejam executados novamente.

---

### 5. Recomendação Final

É altamente recomendável **remover os arquivos de workflow antigos** (`.github/workflows/maven-ci.yml` e `.github/workflows/build-and-push-docker.yml`) para evitar confusão, redundância e execuções inesperadas no futuro, mantendo `ci-cd.yml` como o único pipeline ativo.
