package io.sage.BeesCaatinga.controller.dto.relatorios.vistoria;

import java.time.LocalDate;

public record VistoriaTabelaDTO(
        LocalDate dataVistoria,
        String praga,
        String perdaProducao,
        String observacoes,
        String situacaoColmeia
) {
}
