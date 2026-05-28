
const BASE_URL = 'http://localhost:3000';

const modules = [
  {
    name: 'Insumos',
    endpoint: '/insumos',
    payload: {
      dataInsumo: "28/05/2026",
      nome: "Insumo Teste QA",
      tipoInsumo: "Alimentação",
      quantidade: 50,
      unidadeMedida: "KG",
      dataValidade: "28/05/2027",
      observacoes: "Teste automatizado",
      statusInsumo: "DISPONIVEL",
      produtorId: 1
    },
    updatePayload: {
      nome: "Insumo Teste QA Atualizado",
      quantidade: 75
    }
  },
  {
    name: 'Vistorias',
    endpoint: '/vistorias',
    payload: {
      data: "28/05/2026",
      apiarioId: 1,
      colmeiaId: 1,
      condicaoVistoria: "EXCELENTE",
      observacoes: "Vistoria Teste QA",
      produtorId: 1
    },
    updatePayload: {
      observacoes: "Vistoria Teste QA Atualizada",
      condicaoVistoria: "BOM"
    }
  },
  {
    name: 'Produção',
    endpoint: '/producoes',
    payload: {
      tipoProducao: "Mel de Jandaíra",
      quantidade: 10,
      unidadeMedida: "KG",
      apiarioId: 1,
      colmeiaId: 1,
      dataColeta: "2026-05-28",
      produtorId: 1,
      statusProduto: "EM_ESTOQUE",
      statusQualidade: "NAO_AVALIADO",
      nomeApiario: "Apiário Teste",
      nomeColmeia: "Colmeia Teste"
    },
    updatePayload: {
      quantidade: 15,
      statusQualidade: "BOM"
    }
  }
];

async function runTests() {
  console.log('🚀 Iniciando Testes de Integração API (REST Strict Mode) - BeesCaatinga\n');
  
  for (const module of modules) {
    console.log(`--- Testando Módulo: ${module.name} ---`);
    
    try {
      // 1. GET (Listar)
      const resGet = await fetch(`${BASE_URL}${module.endpoint}`);
      if (resGet.ok) {
        console.log(`✅ GET ${module.endpoint}: Status ${resGet.status} OK`);
      } else {
        console.error(`❌ GET ${module.endpoint}: Status ${resGet.status} FAILED`);
      }

      // 2. POST (Cadastrar)
      const resPost = await fetch(`${BASE_URL}${module.endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(module.payload)
      });
      
      if (resPost.status === 201) {
        // CAPTURA DO ID REAL GERADO PELA API
        const createdItem = await resPost.json();
        const createdId = createdItem.id;
        console.log(`✅ POST ${module.endpoint}: Status 201 CREATED (ID Capturado: ${createdId})`);

        // 3. PUT (Editar) - USO ESTRITO DE PATH PARAMETERS
        const putUrl = `${BASE_URL}${module.endpoint}/${createdId}`;
        const resPut = await fetch(putUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...module.payload, ...module.updatePayload })
        });

        if (resPut.status === 200) {
          console.log(`✅ PUT ${putUrl}: Status 200 OK`);
        } else {
          console.error(`❌ PUT ${putUrl}: Status ${resPut.status} FAILED`);
          const errorData = await resPut.text();
          console.error('Motivo:', errorData);
        }

        // 4. DELETE (Excluir) - USO ESTRITO DE PATH PARAMETERS
        const deleteUrl = `${BASE_URL}${module.endpoint}/${createdId}`;
        const resDel = await fetch(deleteUrl, {
          method: 'DELETE'
        });

        if (resDel.status === 200 || resDel.status === 204) {
          console.log(`✅ DELETE ${deleteUrl}: Status ${resDel.status} OK`);
        } else {
          console.error(`❌ DELETE ${deleteUrl}: Status ${resDel.status} FAILED`);
        }
      } else {
        console.error(`❌ POST ${module.endpoint}: Status ${resPost.status} FAILED`);
      }
    } catch (error) {
      console.error(`💥 Erro fatal no módulo ${module.name}:`, error.message);
    }
    console.log('');
  }
  
  console.log('🏁 Testes finalizados.');
}

runTests();
