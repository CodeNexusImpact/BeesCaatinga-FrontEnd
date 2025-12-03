package io.sage.BeesCaatinga.controller.dto.relatorios.producao;

import java.time.LocalDate;

public record LoteMelDTO(
        Long id,
        LocalDate dataExtracao,
        Double pesoKg
) {
}
