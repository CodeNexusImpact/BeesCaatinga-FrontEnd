import React from 'react';
import MenuModulo from '@/components/menuModulo';

export default function Index() {
  return (
    <MenuModulo
      titulo="Vistorias"
      descricao="Anote como estão as colmeias a cada visita: pragas, perdas e cuidados necessários."
      principal={{ titulo: 'Cadastrar vistoria', icone: 'add', rota: '/vistorias/cadastrar' }}
      opcoes={[
        { titulo: 'Ver vistorias', descricao: 'Todas as vistorias feitas', icone: 'clipboardCheck', rota: '/vistorias/listar' },
        { titulo: 'Resumo das vistorias', descricao: 'Números e gráficos', icone: 'pizzaGraph', rota: '/vistorias/dashboard' },
        { titulo: 'Relatório de vistorias', descricao: 'Tabela, planilha e PDF', icone: 'fileDocument', rota: '/vistorias/tabela' },
      ]}
    />
  );
}
