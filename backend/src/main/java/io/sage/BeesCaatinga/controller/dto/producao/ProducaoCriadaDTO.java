package io.sage.BeesCaatinga.controller.dto.producao;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.sage.BeesCaatinga.model.enums.UnidadeMedida;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ProducaoCriadaDTO(
        @NotBlank(message = "Campo tipo produto é obrigatório!")
        String tipoProducao,
        @NotNull(message = "Campo quantidade é obrigatório!")
        Double quantidade,
        @NotNull(message = "Campo medida é obrigatório!")
        UnidadeMedida unidadeMedida,
        @NotNull(message = "Campo apiário é obrigatório!")
        Long apiarioId,
        @NotNull(message = "Campo colmeia é obrigatório!")
        Long colmeiaId,
        @JsonFormat(pattern = "dd/MM/yyyy")
        @NotNull(message = "Campo data coleta é obrigatório!")
        LocalDate dataColeta
) {
}
