package io.sage.BeesCaatinga.controller.dto.relatorios.producao;

import java.util.List;

public record RelatorioProducaoDTO(
        // cards
        Double producaoTotalKg,
        Double produtividadeMediaPorColmeia,
        Double produtividadeMediaPorApiario,
        Long numeroDeVistorias,

        // Gráfico 1
        List<ProducaoMensalDTO> producaoMensal,

        // Gráfico 2
        List<StatusColmeiasDTO> statusColmeias,

        // Tabela
        List<LoteMelDTO> lotesMel
) {
}
