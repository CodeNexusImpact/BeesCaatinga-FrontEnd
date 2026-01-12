package io.sage.BeesCaatinga.controller.dto.relatorios.rastreabilidade;

import java.util.List;

public record RelatorioRastreabilidadeDTO(
        // Cards
        long totalLotes,
        double pesoTotalRastreavel,
        double porcentagemVendidos,
        double tempoMedioDias,

        // Gráficos
        List<LotesPorTipoAbelhaDTO> graficoTipoAbelha,
        VendidosNaoVendidosDTO graficoVendidos,
        List<LotesPorFloradaDTO> graficoFlorada,

        // Tabela
        List<LoteTabelaDTO> tabela
) {
}
