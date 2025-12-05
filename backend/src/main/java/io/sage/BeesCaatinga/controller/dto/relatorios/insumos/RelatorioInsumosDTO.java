package io.sage.BeesCaatinga.controller.dto.relatorios.insumos;

import java.util.List;

public record RelatorioInsumosDTO(
        // cards
        Long totalInsumos,
        Long insumosEstoqueBaixo,
        Double consumoMedioMensal,

        // graficos
        Long insumosOk,
        Long insumosProximoVencimento,
        List<TipoInsumoQuantidadeDTO> insumosPorTipo,

        // Tabela
        List<InsumoTabelaDTO> tabela
) {
}
