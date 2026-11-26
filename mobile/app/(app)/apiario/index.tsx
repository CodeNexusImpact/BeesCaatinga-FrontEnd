import React from 'react';
import MenuModulo from '@/components/menuModulo';

export default function Index() {
  return (
    <MenuModulo
      titulo="Apiários e Colmeias"
      descricao="Cadastre seus apiários (onde ficam as caixas) e as colmeias de cada um."
      principal={{ titulo: 'Cadastrar apiário', icone: 'add', rota: '/apiario/cadastrar' }}
      opcoes={[
        { titulo: 'Cadastrar colmeia', descricao: 'Uma caixa de abelhas dentro de um apiário', icone: 'beehiveOutline', rota: '/apiario/colmeia/cadastrar' },
        { titulo: 'Ver apiários e colmeias', descricao: 'Lista com mapa', icone: 'map', rota: '/apiario/listar' },
        { titulo: 'Resumo dos apiários', descricao: 'Números e gráficos', icone: 'pizzaGraph', rota: '/apiario/dashboardApiario' },
        { titulo: 'Resumo das colmeias', descricao: 'Situação de cada colmeia', icone: 'pizzaGraph', rota: '/apiario/dashboardColmeia' },
        { titulo: 'Relatório de apiários', descricao: 'Tabela para conferir e exportar', icone: 'fileDocument', rota: '/apiario/tabelaApiario' },
        { titulo: 'Relatório de colmeias', descricao: 'Tabela para conferir e exportar', icone: 'fileDocument', rota: '/apiario/tabelaColmeia' },
      ]}
    />
  );
}
