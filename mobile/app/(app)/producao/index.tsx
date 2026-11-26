import React from 'react';
import MenuModulo from '@/components/menuModulo';

export default function Index() {
  return (
    <MenuModulo
      titulo="Produção de Mel"
      descricao="Registre o mel colhido em cada colmeia, em quilos ou litros."
      principal={{ titulo: 'Cadastrar produção', icone: 'add', rota: '/producao/cadastrar' }}
      opcoes={[
        { titulo: 'Ver produções', descricao: 'Todas as colheitas registradas', icone: 'clipboardCheck', rota: '/producao/listar' },
        { titulo: 'Resumo da produção', descricao: 'Números e gráficos', icone: 'pizzaGraph', rota: '/producao/dashboard' },
        { titulo: 'Relatório de produção', descricao: 'Tabela, planilha e PDF', icone: 'fileDocument', rota: '/producao/tabela' },
      ]}
    />
  );
}
