package io.sage.BeesCaatinga.controller.dto.producao;

import io.sage.BeesCaatinga.model.enums.UnidadeMedida;
import java.time.LocalDate;

public record ProducaoAtualizadaDTO(
        String tipoProducao,
        Double quantidade,
        UnidadeMedida unidadeMedida,
        Long apiarioId,
        Long colmeiaId,
        LocalDate dataColeta
) {
}
