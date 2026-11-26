// Cria uma conta nova e popula dados reais pela API (usado pelas capturas antes/depois e pelo smoke).
const { api } = require('./lib');

async function semear(sufixo = Date.now().toString().slice(-6)) {
  const email = `seed.${sufixo}@beescaatinga.test`;
  const senha = 'Senha@123';
  await api('POST', '/produtores', null, {
    nomeCompleto: 'João Apicultor', telefone: '83987654321', email, dataDeNascimento: '15/03/1980', genero: 'MASCULINO', senha,
  });
  const login = await api('POST', '/login', null, { email, senha });
  const { token, id } = login.dados;
  const ap = (await api('POST', `/apiarios/${id}`, token, {
    nome: 'Apiário Serra Branca', nRegistro: `SISBI ${sufixo}/2026`, dataDeCriacao: '10/01/2024', cep: '58700000', nomeDaPropriedade: 'Sítio Boa Vista',
    estado: 'PB', cidade: 'Patos', bairro: 'Zona Rural', rua: 'Estrada do Mel', numero: 'S/N', complemento: '', observacoes: 'Apiário principal', produtor_id: id,
    latitude: -7.0247, longitude: -37.2806,
  })).dados;
  const cols = [];
  for (const [ident, tipo] of [['CX-01', 'MADEIRA'], ['CX-02', 'MADEIRA'], ['CX-03', 'POLIESTIRENO']]) {
    cols.push((await api('POST', `/colmeias/produtor/${id}/apiario/${ap.id}`, token, {
      identificador: `${ident}-${sufixo}`, apiario_id: ap.id, tipo, ativa: true, observacoes: '', detalhesDaLocalizacao: 'Sombra', latitude: -7.0247, longitude: -37.2806,
    })).dados);
  }
  const datas = ['15/03/2026', '20/06/2026', '10/09/2026', '05/11/2026'];
  for (const [i, d] of datas.entries()) {
    await api('POST', `/vistorias/produtor/${id}/apiario/${ap.id}/colmeia/${cols[i % 3].id}`, token, {
      dataVistoria: d, apiario_id: ap.id, colmeia_id: cols[i % 3].id, condicao: i % 2 ? 'MANUTENCAO_NECESSARIA' : 'SAUDAVEL', pragasIdentificadas: i % 2 ? ['VARROA'] : [], perdasIdentificadas: [], observacoes: `Vistoria ${i + 1}`,
    });
    await api('POST', `/producoes/${id}`, token, {
      tipoProducao: i % 2 ? 'Mel de Marmeleiro' : 'Mel de Jandaíra', quantidade: 10 + i * 5, unidadeMedida: 'KILOGRAMA', apiarioId: ap.id, colmeiaId: cols[i % 3].id, dataColeta: d,
    });
  }
  await api('POST', `/insumos/${id}`, token, { dataEntrada: '01/10/2026', nome: 'Cera alveolada', tipo: 'Cera', quantidade: 5, unidadeMedida: 'KILOGRAMA', dataValidade: '01/10/2027', observacoes: '' });
  await api('POST', `/insumos/${id}`, token, { dataEntrada: '01/10/2026', nome: 'Xarope', tipo: 'Alimento', quantidade: 2, unidadeMedida: 'LITRO', dataValidade: '10/12/2026', observacoes: '' });
  await api('POST', `/lotes/${id}`, token, { dataProducao: '05/11/2026', quantidadeProduzida: 40.5, nomeApiario: ap.nome, tipoFlorada: 'MARMELEIRO', latitude: -7.0247, longitude: -37.2806, tipoAbelha: 'JANDAIRA', vendido: false });
  return { email, senha, token, id, apiario: ap, colmeias: cols };
}

module.exports = { semear };
