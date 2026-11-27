// Recuperar senha: disponibilidade, indisponível (aviso ao suporte) e validações do formulário em 2 passos.
const { secao } = require('./run');
const { api, registrar } = require('./lib');

secao('recuperacao', async (page, h, ctx) => {
  const disp = await api('GET', '/auth/recuperacao-disponivel');
  registrar('recuperacao', 'GET /auth/recuperacao-disponivel responde (sem login)', disp.status === 200 && typeof disp.dados?.disponivel === 'boolean', `${disp.status} ${JSON.stringify(disp.dados)}`);
  const disponivel = !!disp.dados?.disponivel;

  await page.evaluate(() => localStorage.clear());
  await h.ir('/login');
  await h.clicar('Esqueceu a senha?');
  registrar('recuperacao', '"Esqueceu a senha?" abre a recuperação', await h.aguardarUrl(/redefinirSenha/));
  await page.waitForTimeout(2000);

  if (!disponivel) {
    const txt = await h.texto();
    registrar('recuperacao', 'indisponível: aviso para falar com o suporte', txt.includes('Recuperação por e-mail ainda não está disponível. Fale com o suporte da Code Nexus Impact.'));
    await h.foto('29-recuperacao-indisponivel');
    return;
  }

  // Passo 1: e-mail inválido
  await h.preencher('E-mail', 'maria-sem-arroba');
  await h.clicar('Enviar código');
  registrar('recuperacao', 'passo 1: e-mail inválido mostra erro no campo', (await h.texto()).includes('Informe um e-mail válido'));
  await h.preencher('E-mail', ctx.email);
  await h.clicar('Enviar código');
  await page.waitForTimeout(3000);
  const txt1 = await h.texto();
  if (txt1.includes('ainda não está disponível')) {
    registrar('recuperacao', 'e-mail não configurado (503) mostra aviso ao suporte', true);
    return;
  }
  registrar('recuperacao', 'passo 2 exibido após pedir o código (202)', txt1.includes('Passo 2 de 2'));
  await h.foto('29-recuperacao-passo2');

  // Passo 2: validações locais
  await h.preencher('000000', '12');
  await h.preencher('Nova senha', 'fraca');
  await h.preencher('Confirme a nova senha', 'outra');
  await h.clicar('Trocar senha');
  const txt2 = await h.texto();
  registrar('recuperacao', 'código com menos de 6 números é recusado', txt2.includes('O código tem 6 números'));
  registrar('recuperacao', 'senha fraca mostra a regra', txt2.includes('8 ou mais caracteres'));
  registrar('recuperacao', 'confirmação diferente é recusada', txt2.includes('As senhas não são iguais.'));

  // Código errado → 400 do backend exibido no campo
  await h.preencher('000000', '000000');
  await h.preencher('Nova senha', 'Mel@2026x');
  await h.preencher('Confirme a nova senha', 'Mel@2026x');
  await h.clicar('Trocar senha');
  await page.waitForTimeout(2500);
  registrar('recuperacao', 'código inválido: erro do servidor exibido e continua no passo 2', (await h.texto()).includes('Passo 2 de 2') && /inválid|expirad|vencid/i.test(await h.texto()));
  const r = await api('POST', '/auth/redefinir-senha', null, { email: ctx.email, codigo: '000000', novaSenha: 'Mel@2026x' });
  registrar('recuperacao', 'API: código inválido → 400', r.status === 400, String(r.status));
  const login = await api('POST', '/login', null, { email: ctx.email, senha: ctx.senha });
  registrar('recuperacao', 'senha antiga continua válida após tentativa com código errado', login.status === 200, String(login.status));
});
