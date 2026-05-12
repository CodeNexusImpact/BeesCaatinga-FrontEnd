# Build stage: usa Maven com JDK 21
FROM maven:3.9.4-eclipse-temurin-21 as build
ARG SKIP_TESTS=false
WORKDIR /workspace

# Copia apenas o POM primeiro para aproveitar cache do Docker
COPY pom.xml .

# Copia o diretório src
COPY src ./src

# build do artefato; altere SKIP_TESTS para true se quiser pular os testes
RUN mvn -B  -DskipTests=${SKIP_TESTS} clean package

# Runtime stage: usa OpenJDK 21
FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app

# Copia o artefato construído do estágio de build
COPY --from=build /workspace/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]