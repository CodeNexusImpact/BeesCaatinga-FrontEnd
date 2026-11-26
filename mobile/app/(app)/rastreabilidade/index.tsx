import React from 'react';
import MenuModulo from '@/components/menuModulo';

export default function Index() {
  return (
    <MenuModulo
      titulo="Lotes"
      descricao="Junte o mel colhido em lotes. O número do lote mostra a origem do mel até a venda."
      principal={{ titulo: 'Cadastrar lote', icone: 'add', rota: '/rastreabilidade/cadastrar' }}
      opcoes={[
        { titulo: 'Ver lotes', descricao: 'Todos os lotes e sua origem', icone: 'qrcodeScan', rota: '/rastreabilidade/listar' },
        { titulo: 'Resumo dos lotes', descricao: 'Números e gráficos', icone: 'pizzaGraph', rota: '/rastreabilidade/dashboard' },
        { titulo: 'Relatório de rastreabilidade', descricao: 'Tabela, planilha e PDF', icone: 'fileDocument', rota: '/rastreabilidade/tabela' },
      ]}
    />
  );
}
