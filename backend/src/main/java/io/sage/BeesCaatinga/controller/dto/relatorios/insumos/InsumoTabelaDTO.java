package io.sage.BeesCaatinga.controller.dto.relatorios.insumos;

import java.time.LocalDate;

public record InsumoTabelaDTO(
        Long id,
        LocalDate dataEntrada,
        String nome,
        String tipo,
        Double quantidade,
        String unidadeMedida,
        String statusInsumo,
        LocalDate dataValidade
) {
}
