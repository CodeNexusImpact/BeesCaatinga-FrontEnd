const BASE_URL = 'http://localhost:3000';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const modules = [
  {
    name: 'INSUMOS',
    endpoint: '/insumos',
    payload: {
      dataInsumo: "30/05/2026",
      nome: "Insumo QA Visual",
      tipoInsumo: "Alimentação",
      quantidade: 10,
      unidadeMedida: "KG",
      dataValidade: "30/05/2027",
      observacoes: "Teste Visual",
      statusInsumo: "DISPONIVEL",
      produtorId: 1
    },
    updatePayload: {
      quantidade: 20
    }
  },
  {
    name: 'VISTORIAS',
    endpoint: '/vistorias',
    payload: {
      data: "30/05/2026",
      apiarioId: 1,
      colmeiaId: 1,
      condicaoVistoria: "EXCELENTE",
      observacoes: "Vistoria QA Visual",
      produtorId: 1
    },
    updatePayload: {
      condicaoVistoria: "BOM"
    }
  },
  {
    name: 'PRODUÇÕES',
    endpoint: '/producoes',
    payload: {
      tipoProducao: "Mel",
      quantidade: 5,
      unidadeMedida: "KG",
      apiarioId: 1,
      colmeiaId: 1,
      dataColeta: "2026-05-30",
      produtorId: 1,
      statusProduto: "EM_ESTOQUE",
      statusQualidade: "NAO_AVALIADO",
      nomeApiario: "Apiário Teste",
      nomeColmeia: "Colmeia Teste"
    },
    updatePayload: {
      quantidade: 15
    }
  },
  {
    name: 'LOTES',
    endpoint: '/lotes',
    payload: {
      dataProducao: "30/05/2026",
      apiarioId: 1,
      quantidadeProduzida: 100,
      tipoFlorada: "Silvestre",
      tipoAbelha: "Italiana",
      vendido: false,
      produtorId: 1
    },
    updatePayload: {
      quantidadeProduzida: 120
    }
  }
];

async function runVisualQA() {
  console.log('\n🎭 INICIANDO SHOW VISUAL DE QA AUTOMATIZADO 🎭\n');

  for (const mod of modules) {
    console.log(`\n=========================================`);
    console.log(`🎬 MÓDULO: ${mod.name}`);
    console.log(`=========================================\n`);

    try {
      await delay(1000);

      // 1. POST
      const postRes = await fetch(`${BASE_URL}${mod.endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mod.payload)
      });
      if (!postRes.ok) throw new Error(`[POST] Rota: ${mod.endpoint} | Status: ${postRes.status}`);
      const createdItem = await postRes.json();
      const id = createdItem.id;
      console.log(`[${mod.name}] 🟢 INSERINDO DADO... Status ${postRes.status} | ID: ${id}`);

      await delay(1000);

      // 2. GET
      const getRes = await fetch(`${BASE_URL}${mod.endpoint}`);
      if (!getRes.ok) throw new Error(`[GET] Rota: ${mod.endpoint} | Status: ${getRes.status}`);
      const data = await getRes.json();
      console.log(`[${mod.name}] 🔵 LENDO DADOS... Status ${getRes.status} | Total de registros: ${data.length}`);

      await delay(1000);

      // 3. PUT
      const putRes = await fetch(`${BASE_URL}${mod.endpoint}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...mod.payload, ...mod.updatePayload })
      });
      if (!putRes.ok) throw new Error(`[PUT] Rota: ${mod.endpoint}/${id} | Status: ${putRes.status}`);
      console.log(`[${mod.name}] 🟠 ATUALIZANDO DADO... Status ${putRes.status}`);

      await delay(1000);

      // 4. DELETE
      const delRes = await fetch(`${BASE_URL}${mod.endpoint}/${id}`, {
        method: 'DELETE'
      });
      if (!delRes.ok) throw new Error(`[DELETE] Rota: ${mod.endpoint}/${id} | Status: ${delRes.status}`);
      console.log(`[${mod.name}] 🔴 DELETANDO DADO... Status ${delRes.status}`);

      await delay(1000);

    } catch (error) {
      console.error(`\n❌ FALHA CRÍTICA`);
      console.error(`Detalhes: ${error.message}\n`);
    }
  }

  console.log('\n✅ SHOW VISUAL DE QA CONCLUÍDO COM SUCESSO!\n');
}

runVisualQA();
