package io.sage.BeesCaatinga.controller.dto.insumo;

import io.sage.BeesCaatinga.model.enums.StatusInsumo;
import io.sage.BeesCaatinga.model.enums.UnidadeMedida;

import java.time.LocalDate;

public record InsumoRetornoDTO(
        LocalDate dataEntrada,
        String nome,
        String tipo,
        Double quantidade,
        UnidadeMedida unidadeMedida,
        StatusInsumo statusInsumo,
        String observacoes
) {
}
