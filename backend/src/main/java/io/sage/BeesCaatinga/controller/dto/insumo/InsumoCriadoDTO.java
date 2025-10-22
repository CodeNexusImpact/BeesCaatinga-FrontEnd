package io.sage.BeesCaatinga.controller.dto.insumo;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.sage.BeesCaatinga.model.enums.UnidadeMedida;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record InsumoCriadoDTO(
        @NotNull(message = "Campo data de entrada é obrigatório!")
        @JsonFormat(pattern = "dd/MM/yyyy")
        LocalDate dataEntrada,
        @NotBlank(message = "Campo nome do insumo é obrigatório!")
        String nome,
        String tipo,
        Double quantidade,
        UnidadeMedida unidadeMedida,
        @JsonFormat(pattern = "dd/MM/yyyy")
        LocalDate dataValidade,
        String observacoes //if blank = "Não informado"
        // por padrão, ao criar, atributo StatusInsumo statusInsumo = ativo
) {
}
