package io.sage.BeesCaatinga.controller.dto.lote;

import java.time.LocalDate;

public record LoteRetornoListadoDTO(
        Long id,
        LocalDate dataProducao,
        Double quantidadeProduzida,
        String nomeApiario
) {
}
