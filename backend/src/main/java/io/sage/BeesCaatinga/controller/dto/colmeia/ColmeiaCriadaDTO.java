package io.sage.BeesCaatinga.controller.dto.colmeia;

import io.sage.BeesCaatinga.model.enums.TipoColmeia;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ColmeiaCriadaDTO(
        @NotBlank(message = "Campo Identificador é obrigatório!")
        String identificador,
        @NotBlank(message = "Campo apiario_id é obrigatório!")
        Long apiario_id,
        @NotNull(message = "Campo Tipo é obrigatório!")
        TipoColmeia tipo,
        @NotNull(message = "Campo Ativo é obrigatório!")
        Boolean ativa,
        String observacoes,
        String detalhesDaLocalizacao,
        String caminhoDaFoto,
        @NotNull(message = "Campo latitude é obrigatório!")
        BigDecimal latitude,
        @NotNull(message = "Campo longitude é obrigatório!")
        BigDecimal longitude
) {
}
