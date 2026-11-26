import React from 'react';
import MenuModulo from '@/components/menuModulo';

export default function Index() {
  return (
    <MenuModulo
      titulo="Relatórios"
      descricao="Escolha um relatório para ver a tabela, baixar a planilha (CSV) ou gerar o PDF."
      principal={{ titulo: 'Relatório de produção', icone: 'fileDocument', rota: '/producao/tabela' }}
      opcoes={[
        { titulo: 'Relatório de vistorias', descricao: 'Tabela, planilha e PDF', icone: 'clipboardCheck', rota: '/vistorias/tabela' },
        { titulo: 'Relatório de rastreabilidade', descricao: 'Lotes: tabela, planilha e PDF', icone: 'qrcodeScan', rota: '/rastreabilidade/tabela' },
        { titulo: 'Relatório de apiários', descricao: 'Tabela e planilha', icone: 'map', rota: '/apiario/tabelaApiario' },
        { titulo: 'Relatório de colmeias', descricao: 'Tabela e planilha', icone: 'beehiveOutline', rota: '/apiario/tabelaColmeia' },
        { titulo: 'Relatório de insumos', descricao: 'Tabela e planilha', icone: 'package', rota: '/insumos/tabela' },
      ]}
    />
  );
}
