package io.sage.BeesCaatinga.controller.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.sage.BeesCaatinga.model.enums.StatusColmeia;
import io.sage.BeesCaatinga.model.enums.TipoColmeia;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ColmeiaDTO(
        @NotBlank(message = "Campo Identificador é obrigatório!")
        String identificador,
        @NotBlank(message = "Campo apiario_id é obrigatório!")
        Long apiario_id,
        @NotNull(message = "Campo Tipo é obrigatório!")
        TipoColmeia tipo,
        @NotNull(message = "Campo Ativo é obrigatório!")
        Boolean ativa,
        String observacoes,
        StatusColmeia situacao,
        @JsonFormat(pattern = "dd/MM/yyyy")
        LocalDate ultimaVistoria,
        String detalhesDaLocalizacao,
        String caminhoDaFoto
) {
}
