package io.sage.BeesCaatinga.controller.dto.relatorios.rastreabilidade;

import java.time.LocalDate;

public record LoteTabelaDTO(
        Long id,
        LocalDate dataProducao,
        double quantidadeProduzida,
        String florada,
        String localidade,
        String tipoAbelha
) {
}
