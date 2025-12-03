package io.sage.BeesCaatinga.controller.dto;

public record FiltroBuscaDTO(
        Integer ano,
        String estacao,   // verão, outono, inverno, primavera ou null
        Integer mes,      // 1 a 12 ou null
        Long apiarioId,
        Long colmeiaId    // opcional
) {
}
