package io.sage.BeesCaatinga.controller.dto.colmeia;

import io.sage.BeesCaatinga.model.enums.TipoColmeia;
import java.math.BigDecimal;

public record ColmeiaAtualizadaDTO(
        String identificador,
        Long apiario_id,
        TipoColmeia tipo,
        Boolean ativa,
        String observacoes,
        String detalhesDaLocalizacao,
        String caminhoDaFoto,
        BigDecimal latitude,
        BigDecimal longitude
) {
}
