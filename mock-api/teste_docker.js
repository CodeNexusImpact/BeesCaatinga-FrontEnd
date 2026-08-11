const BASE_URL = 'http://localhost:8080';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function seedDatabase() {
  console.log('🌱 Semeando banco de dados para os testes...');
  
  // 1. Criar Produtor
  const produtorRes = await fetch(`${BASE_URL}/produtores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nomeCompleto: "Produtor QA Docker",
      email: `qadocker${Date.now()}@teste.com`,
      telefone: "83988888888",
      senha: "SenhaSegura123!",
      genero: "MASCULINO",
      dataDeNascimento: "01/01/1980"
    })
  });
  if (!produtorRes.ok) {
    console.error("Erro ao criar Produtor:", await produtorRes.text());
    return { produtorId: 1, apiarioId: 1, colmeiaId: 1 };
  }
  const produtor = await produtorRes.json();
  const produtorId = produtor.id;
  console.log(`✅ Produtor criado: ID ${produtorId}`);

  // 2. Criar Apiário
  const apiarioRes = await fetch(`${BASE_URL}/apiarios/${produtorId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: "Apiário QA Docker",
      nRegistro: "REG-12345",
      cep: "58052-510",
      nomeDaPropriedade: "Fazenda QA",
      estado: "PB",
      cidade: "João Pessoa",
      bairro: "Bancários",
      rua: "Rua QA",
      numero: "123",
      latitude: -8.0743,
      longitude: -39.1189,
      produtor_id: produtorId
    })
  });
  if (!apiarioRes.ok) {
    console.error("Erro ao criar Apiário:", await apiarioRes.text());
    return { produtorId, apiarioId: 1, colmeiaId: 1 };
  }
  const apiario = await apiarioRes.json();
  const apiarioId = apiario.id;
  console.log(`✅ Apiário criado: ID ${apiarioId}`);

  // 3. Criar Colmeia
  const colmeiaRes = await fetch(`${BASE_URL}/colmeias/produtor/${produtorId}/apiario/${apiarioId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identificador: "C01-QA",
      apiario_id: apiarioId,
      tipo: "LANGSTROTH",
      ativa: true,
      latitude: -8.0743,
      longitude: -39.1189
    })
  });
  if (!colmeiaRes.ok) {
    console.error("Erro ao criar Colmeia:", await colmeiaRes.text());
    return { produtorId, apiarioId, colmeiaId: 1 };
  }
  const colmeia = await colmeiaRes.json();
  const colmeiaId = colmeia.id;
  console.log(`✅ Colmeia criada: ID ${colmeiaId}`);

  return { produtorId, apiarioId, colmeiaId };
}

const getModules = (produtorId, apiarioId, colmeiaId) => [
  {
    name: 'INSUMOS',
    postPath: (pId) => `/insumos/${pId}`,
    getPath: (pId) => `/insumos/${pId}`,
    putPath: (id, pId) => `/insumos/${id}/produtor/${pId}`,
    deletePath: (id, pId) => `/insumos/${id}/produtor/${pId}`,
    payload: {
      dataEntrada: "30/05/2026",
      nome: "Insumo QA Docker",
      tipo: "Alimentação",
      quantidade: 10.5,
      unidadeMedida: "KILOGRAMA",
      dataValidade: "30/05/2027",
      observacoes: "Teste Docker Spring Boot"
    },
    updatePayload: {
      dataEntrada: "30/05/2026",
      nome: "Insumo QA Docker Atualizado",
      quantidade: 25.0,
      tipo: "Alimentação",
      unidadeMedida: "KILOGRAMA",
      statusInsumo: "DISPONIVEL",
      dataValidade: "30/05/2027",
      observacoes: "Atualizado"
    }
  },
  {
    name: 'VISTORIAS',
    postPath: (pId, aId = apiarioId, cId = colmeiaId) => `/vistorias/produtor/${pId}/apiario/${aId}/colmeia/${cId}`,
    getPath: (pId) => `/vistorias/${pId}`,
    putPath: (id, pId) => `/vistorias/${id}/produtor/${pId}`,
    deletePath: (id, pId) => `/vistorias/${id}/produtor/${pId}`,
    payload: {
      dataVistoria: "30/05/2026",
      apiario_id: apiarioId,
      colmeia_id: colmeiaId,
      condicao: "SAUDAVEL",
      pragasIdentificadas: [],
      perdasIdentificadas: [],
      observacoes: "Vistoria QA Docker"
    },
    updatePayload: {
      dataVistoria: "30/05/2026",
      condicao: "MANUTENCAO_NECESSARIA",
      pragasIdentificadas: [],
      perdasIdentificadas: [],
      observacoes: "Vistoria QA Docker Atualizada"
    }
  },
  {
    name: 'PRODUÇÕES',
    postPath: (pId) => `/producoes/${pId}`,
    getPath: (pId) => `/producoes/${pId}`,
    putPath: (id, pId) => `/producoes/${id}/produtor/${pId}`,
    deletePath: (id, pId) => `/producoes/${id}/produtor/${pId}`,
    payload: {
      tipoProducao: "Mel de Jandaíra",
      quantidade: 5.5,
      unidadeMedida: "KILOGRAMA",
      apiarioId: apiarioId,
      colmeiaId: colmeiaId,
      dataColeta: "30/05/2026"
    },
    updatePayload: {
      tipoProducao: "Mel de Jandaíra",
      quantidade: 15.0,
      unidadeMedida: "KILOGRAMA",
      apiarioId: apiarioId,
      colmeiaId: colmeiaId,
      dataColeta: "30/05/2026"
    }
  },
  {
    name: 'LOTES',
    postPath: (pId) => `/lotes/${pId}`,
    getPath: (pId) => `/lotes/${pId}/detalhado`,
    putPath: null, 
    deletePath: null, 
    payload: {
      dataProducao: "30/05/2026",
      quantidadeProduzida: 100.0,
      nomeApiario: "Apiário QA Docker",
      tipoFlorada: "SILVESTRE",
      latitude: -8.0743,
      longitude: -39.1189,
      tipoAbelha: "APIS_MELLIFERA",
      vendido: false
    },
    updatePayload: null
  }
];

async function runDockerQA() {
  console.log('\n🚢 INICIANDO VALIDAÇÃO DO BACKEND REAL (DOCKER:8080) 🚢\n');
  
  const { produtorId, apiarioId, colmeiaId } = await seedDatabase();
  const modules = getModules(produtorId, apiarioId, colmeiaId);

  for (const mod of modules) {
    console.log(`\n--- MÓDULO: ${mod.name} ---`);

    try {
      // 1. POST (Cadastrar)
      const postUrl = `${BASE_URL}${mod.postPath(produtorId)}`;
      console.log(`🚀 POST ${postUrl}...`);
      const postRes = await fetch(postUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mod.payload)
      });

      const postBody = await postRes.text();
      if (!postRes.ok) {
        console.error(`❌ [POST] FAILED | Status: ${postRes.status}`);
        console.error(`Mensagem Java: ${postBody}`);
        continue;
      }

      const createdItem = JSON.parse(postBody);
      const id = createdItem.id || createdItem.codigo || 1;
      console.log(`✅ [POST] Status ${postRes.status} | DTO Retornado:`, createdItem);

      await delay(500);

      // 2. GET (Listar/Verificar)
      const getUrl = `${BASE_URL}${mod.getPath(produtorId)}`;
      console.log(`🔍 GET ${getUrl}...`);
      const getRes = await fetch(getUrl);
      if (getRes.ok) {
        const data = await getRes.json();
        const total = Array.isArray(data) ? data.length : 'N/A';
        console.log(`✅ [GET] Status ${getRes.status} | Registros: ${total}`);
      } else {
        const getBody = await getRes.text();
        console.warn(`⚠️ [GET] Status ${getRes.status} | Body: ${getBody}`);
      }

      await delay(500);

      // 3. PUT (Editar)
      if (mod.putPath) {
        const putUrl = `${BASE_URL}${mod.putPath(id, produtorId)}`;
        console.log(`⚙️ PUT ${putUrl}...`);
        const putRes = await fetch(putUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mod.updatePayload)
        });

        if (putRes.ok) {
          console.log(`✅ [PUT] Status ${putRes.status} OK`);
        } else {
          const putBody = await putRes.text();
          console.error(`❌ [PUT] FAILED | Status: ${putRes.status} | Body: ${putBody}`);
        }
      }

      await delay(500);

      // 4. DELETE (Limpar)
      if (mod.deletePath) {
        const deleteUrl = `${BASE_URL}${mod.deletePath(id, produtorId)}`;
        console.log(`🗑️ DELETE ${deleteUrl}...`);
        const delRes = await fetch(deleteUrl, { method: 'DELETE' });
        if (delRes.ok || delRes.status === 204) {
          console.log(`✅ [DELETE] Status ${delRes.status} OK`);
        } else {
          const delBody = await delRes.text();
          console.error(`❌ [DELETE] FAILED | Status: ${delRes.status} | Body: ${delBody}`);
        }
      }

    } catch (error) {
      console.error(`💥 ERRO FATAL: ${error.message}`);
    }
  }

  console.log('\n🏁 VALIDAÇÃO DOCKER FINALIZADA.\n');
}

runDockerQA();