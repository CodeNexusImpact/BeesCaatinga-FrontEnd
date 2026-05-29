/**
 * BeesCaatinga - QA Integration Alignment Test
 * 
 * Este script simula as chamadas do Mobile e valida contra as definições do Backend.
 */

const fs = require('fs');
const path = require('path');

console.log("🚀 Iniciando Teste de Alinhamento de Integração (QA Mode)\n");

const mismatches = [];

function checkEndpoint(name, mobilePath, backendExpectedPath) {
    if (mobilePath !== backendExpectedPath) {
        mismatches.push({
            funcionalidade: name,
            mobile: mobilePath,
            backend: backendExpectedPath,
            status: '❌ MISMATCH'
        });
    } else {
        mismatches.push({
            funcionalidade: name,
            mobile: mobilePath,
            backend: backendExpectedPath,
            status: '✅ OK'
        });
    }
}

// Mapeamento extraído da análise de código
checkEndpoint("Login", "/login", "/auth/login");
checkEndpoint("Listar Apiários", "/apiarios?produtorId={id}", "/apiarios/{produtorId}");
checkEndpoint("Cadastrar Apiário", "/apiarios/{produtorId}", "/apiarios/{produtorId}");
checkEndpoint("Listar Colmeias", "/colmeias/apiario/{id}", "/colmeias/produtor/{produtorId}/apiario/{apiarioId}");
checkEndpoint("Listar Insumos", "/insumos?produtorId={id}", "/insumos/{produtorId}");
checkEndpoint("Listar Lotes", "/lotes?produtorId={id}", "/lotes/{produtorId}");

console.table(mismatches);

console.log("\n🔍 Verificando Modelos de Dados...");

// Simulação de verificação de campos
const apiarioDTOFields = ["nome", "nRegistro", "dataDeCriacao", "cep", "nomeDaPropriedade", "produtor_id"]; // simplificado
const dbApiarioFields = ["nome", "n_registro", "data_de_criacao", "cep", "nome_da_propriedade", "produtor_id"];

console.log("- DTO Apiário usa 'produtor_id' (alinhado com DB, mas fora do padrão Java camelCase)");

console.log("\n⚠️ CONCLUSÃO DO QA:");
console.log("O sistema NÃO está totalmente alinhado. O Mobile está 'falando uma língua' (Mock API) ");
console.log("e o Backend está 'falando outra' (RESTful estruturado).");
console.log("É necessário ajustar os Services do Mobile para baterem com os Controllers do Spring Boot.");
