README do projeto com instruções passo a passo para usar Docker, Docker Compose, Java e Maven.

```markdown
# BeesCaatinga

## Sobre
Projeto Java \- Spring Boot gerenciado com Maven. Este README descreve como compilar, testar e empacotar a aplicação localmente e em containers Docker, além dos comandos básicos de Java e Maven.

## Arquivos principais
1. `Dockerfile` \- multi\-stage para compilar com Maven e rodar com Java 21.
2. `docker-compose.yml` \- orquestração para executar o serviço localmente.
3. `.github/workflows/ci.yml` \- pipeline CI para executar testes no GitHub Actions.
4. `pom.xml` \- configuração do Maven.

## Pré\-requisitos
1. Java 21 instalado (para executar localmente).
2. Maven instalado (para build local).
3. Docker instalado.
4. Docker Compose (ou Docker com suporte a compose).
5. Conta e repositório no GitHub para usar o workflow CI.

## Passo a passo

### 1\. Compilar e executar localmente com Maven e Java
1. Compilar e empacotar o JAR:
```bash
mvn -B -DskipTests=false clean package
```
2. Executar os testes (separado):
```bash
mvn test
```
3. Executar a aplicação localmente (após `package`):
```bash
java -jar target/SEU_ARTEFATO.jar
```
Substituir `SEU_ARTEFATO.jar` pelo nome do JAR gerado em `target/`.

### 2\. Construir a imagem Docker
O `Dockerfile` usa multi\-stage: um stage com Maven e JDK 21 para compilar e outro com OpenJDK 21 para rodar o JAR.
1. Construir imagem (pulando testes):
```bash
docker build --build-arg SKIP_TESTS=true -t beescaatinga:latest -f Dockerfile .
```
2. Construir imagem (executando testes):
```bash
docker build --build-arg SKIP_TESTS=false -t beescaatinga:latest -f Dockerfile .
```

### 3\. Executar container Docker
1. Executar a imagem (mapeando porta 8080):
```bash
docker run -p 8080:8080 --name beescaatinga beescaatinga:latest
```
2. Ver logs do container:
```bash
docker logs -f beescaatinga
```
3. Parar e remover:
```bash
docker stop beescaatinga
docker rm beescaatinga
```

### 4\. Usar Docker Compose
Arquivo `docker-compose.yml` facilita executar o serviço com um comando.
1. Subir o serviço:
```bash
docker compose up --build
```
2. Rodar em background:
```bash
docker compose up -d --build
```
3. Parar e remover:
```bash
docker compose down
```

### 5\. Pipeline CI (GitHub Actions)
O workflow em `.github/workflows/ci.yml` realiza:
1. Checkout do repositório.
2. Setup do JDK 21 (ou Temurin 17, ajustar conforme o arquivo).
3. Cache do Maven.
4. Execução de `mvn -B -DskipTests=false test`.

Para garantir que o CI use Java 21, verifique e atualize:
```yaml
uses: actions/setup-java@v4
with:
  distribution: temurin
  java-version: '21'
  cache: 'maven'
```

## Dicas e resolução de problemas comuns
1. Erro de memória no Maven dentro do container: ajuste variáveis `MAVEN_OPTS` ou recursos do Docker.
2. Porta ocupada: verifique processos locais ou altere mapeamento de porta em `docker run` ou `docker-compose.yml`.
3. Falha nos testes no CI: execute `mvn test` localmente para reproduzir antes de abrir PR.

## Referência rápida dos comandos
1. Maven build:
```bash
mvn -B -DskipTests=false clean package
```
2. Maven tests:
```bash
mvn test
```
3. Docker build:
```bash
docker build -t beescaatinga:latest -f Dockerfile .
```
4. Docker run:
```bash
docker run -p 8080:8080 beescaatinga:latest
```
5. Docker Compose up:
```bash
docker compose up --build
```

```
