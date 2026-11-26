import React from 'react';
import MenuModulo from '@/components/menuModulo';

export default function Index() {
  return (
    <MenuModulo
      titulo="Insumos"
      descricao="Controle o que você usa no apiário: cera, xarope, remédios e materiais."
      principal={{ titulo: 'Cadastrar insumo', icone: 'add', rota: '/insumos/cadastrar' }}
      opcoes={[
        { titulo: 'Ver insumos', descricao: 'Estoque e validade', icone: 'package', rota: '/insumos/listar' },
        { titulo: 'Resumo dos insumos', descricao: 'Números e gráficos', icone: 'pizzaGraph', rota: '/insumos/dashboard' },
        { titulo: 'Relatório de insumos', descricao: 'Tabela e planilha', icone: 'fileDocument', rota: '/insumos/tabela' },
      ]}
    />
  );
}
