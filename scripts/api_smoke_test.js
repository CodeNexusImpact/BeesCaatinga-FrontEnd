/**
 * BeesCaatinga - API Smoke Test (Versão Robusta)
 * Exibe mensagens de erro detalhadas do Backend.
 */

const BASE_URL = 'http://localhost:8080';

async function runTests() {
    console.log('🚀 Iniciando Testes Automatizados da API...\n');
    let produtorId;

    try {
        // 1. Testar Cadastro de Produtor
        console.log('1. Testando Cadastro de Produtor...');
        const resProdutor = await fetch(`${BASE_URL}/produtores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nomeCompleto: "Produtor Automatizado",
                telefone: "84999998888",
                email: `teste_${Date.now()}@api.com`,
                dataDeNascimento: "10/10/1985",
                genero: "MASCULINO",
                senha: "senha_segura"
            })
        });

        if (!resProdutor.ok) {
            const errorBody = await resProdutor.text();
            throw new Error(`Falha ao cadastrar produtor (${resProdutor.status}): ${errorBody}`);
        }
        const produtor = await resProdutor.json();
        produtorId = produtor.id;
        console.log(`✅ Produtor cadastrado com ID: ${produtorId}\n`);

        // 2. Testar Listagem de Apiários
        console.log(`2. Testando Listagem de Apiários para o Produtor ${produtorId}...`);
        const resApiarios = await fetch(`${BASE_URL}/apiarios/${produtorId}`);
        if (!resApiarios.ok) throw new Error('Falha ao listar apiários');
        console.log(`✅ Listagem de apiários funcionando!\n`);

        // 3. Testar Cadastro de Apiário
        console.log('3. Testando Cadastro de um novo Apiário...');
        const apiarioData = {
            nome: "Apiário de Teste Automático",
            nRegistro: `REG-${Math.floor(Math.random() * 1000000)}`, // Número aleatório para evitar erro de duplicidade
            dataDeCriacao: "01/01/2024",
            cep: "59000-000",
            nomeDaPropriedade: "Fazenda de Teste",
            estado: "RN",
            cidade: "Mossoró",
            bairro: "Rural",
            rua: "Estrada de Barro",
            numero: "10",
            complemento: "Perto do poço",
            observacoes: "Teste de integração",
            produtor_id: produtorId, // Campo obrigatório no DTO
            latitude: -5.188,
            longitude: -37.344
        };

        const resNovoApiario = await fetch(`${BASE_URL}/apiarios/${produtorId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(apiarioData)
        });

        if (!resNovoApiario.ok) {
            const errorBody = await resNovoApiario.text();
            throw new Error(`Falha ao cadastrar apiário (${resNovoApiario.status}): ${errorBody}`);
        }
        console.log('✅ Apiário cadastrado com sucesso!\n');

        console.log('🎉 TODOS OS TESTES PASSARAM COM SUCESSO!');

    } catch (error) {
        console.error('❌ ERRO DURANTE OS TESTES:');
        console.error(error.message);
        process.exit(1);
    }
}

runTests();
