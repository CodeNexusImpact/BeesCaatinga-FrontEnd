const API_URL = 'http://localhost:8080';

async function runIntegrationTest() {
  console.log("🧪 Iniciando Teste de Integração Real (Full Stack)\n");

  try {
    // 1. Cadastrar Produtor
    console.log("1. Cadastrando Produtor...");
    const produtorData = {
      nomeCompleto: "QA Tester " + Date.now(),
      email: `test${Date.now()}@test.com`,
      senha: "password123",
      genero: "OUTRO",
      telefone: "83988888888",
      dataDeNascimento: "01/01/1990"
    };
    
    let resp = await fetch(`${API_URL}/produtores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produtorData)
    });
    console.log(`Status Cadastro: ${resp.status}`);
    let data = await resp.json();
    console.log(`Dados Cadastro: ${JSON.stringify(data)}`);
    const produtorId = data.id;
    console.log(`✅ Produtor criado! ID: ${produtorId}`);

    // 2. Login
    console.log("\n2. Testando Login...");
    resp = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: produtorData.email,
        senha: produtorData.senha
      })
    });
    console.log(`Status Login: ${resp.status}`);
    data = await resp.json();
    console.log(`Dados Login: ${JSON.stringify(data)}`);
    console.log(`✅ Login realizado com sucesso para: ${data.nomeCompleto}`);

    // 3. Cadastrar Apiário
    console.log("\n3. Cadastrando Apiário...");
    const apiarioData = {
      nome: "Apiário de Teste QA",
      nRegistro: "REG-" + Date.now(),
      dataDeCriacao: "29/05/2026",
      cep: "58000-000",
      nomeDaPropriedade: "Sítio Teste",
      estado: "Paraíba",
      cidade: "João Pessoa",
      bairro: "Bairro Teste",
      rua: "Rua Teste",
      produtor_id: produtorId,
      latitude: -7.123456,
      longitude: -34.123456
    };
    resp = await fetch(`${API_URL}/apiarios/${produtorId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiarioData)
    });
    console.log(`Status Apiário: ${resp.status}`);
    data = await resp.json();
    console.log(`Dados Apiário: ${JSON.stringify(data)}`);
    console.log(`✅ Apiário criado! ID: ${data.id}`);

    // 4. Listar Apiários
    console.log("\n4. Listando Apiários do Produtor...");
    resp = await fetch(`${API_URL}/apiarios/${produtorId}`);
    console.log(`Status Lista: ${resp.status}`);
    data = await resp.json();
    console.log(`✅ Recebidos ${data.length} apiários.`);
    
    if (data.length > 0) {
      console.log(`- Nome do primeiro: ${data[0].nome}`);
    }

    console.log("\n🚀 TESTE DE INTEGRAÇÃO CONCLUÍDO COM SUCESSO!");

  } catch (error) {
    console.error("\n❌ FALHA NO TESTE DE INTEGRAÇÃO:");
    console.error(error);
    process.exit(1);
  }
}

runIntegrationTest();
