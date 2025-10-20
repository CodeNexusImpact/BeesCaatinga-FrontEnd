package io.sage.BeesCaatinga.controller.dto.colmeia;

import io.sage.BeesCaatinga.model.enums.StatusColmeia;
import io.sage.BeesCaatinga.model.enums.TipoColmeia;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ColmeiaRetornoDTO(
        String identificador,
        String caminhoDaFoto,
        String nomeApiario,
        TipoColmeia tipo,
        StatusColmeia statusColmeia,
        LocalDate ultimaVistoria,
        String observacoes,
        BigDecimal latitude,
        BigDecimal longitude,
        String detalhesDaLocalizacao
) {
}
